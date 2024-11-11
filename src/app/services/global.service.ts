import { Injectable } from '@angular/core';
import { ProfesorService } from '@services/profesor.service';
import { TokenService } from '@services/token.service';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { EntidadService } from '@services/entidad.service';
import { EntidadUsuario } from '@models/entidad.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private profesorId: number | null = null;
  private entidadId: number | null = null;

  constructor(
    private _tokenService: TokenService,
    private _profesorService: ProfesorService,
    private _entidadService: EntidadService
  ) {}

  getProfesorId(): Observable<number | null> {
    if (this.profesorId !== null) {
      return of(this.profesorId);
    }
  
    const sub = this._tokenService.getSub();
    if (sub) {
      //console.log('Valor de sub:', sub);
      return this._profesorService.getProfesorId(sub).pipe(
        map(dataResponse => {
          //console.log('Respuesta completa del servidor:', dataResponse);
          
          // Verifica si dataResponse es un array y accede al primer elemento
          if (Array.isArray(dataResponse) && dataResponse.length > 0 && dataResponse[0].id) {
            this.profesorId = dataResponse[0].id;
            //console.log('ID encontrado:', this.profesorId);
            return this.profesorId;
          } else {
            console.error('No se encontró el campo "id" en la respuesta.');
            return null;
          }
        }),
        catchError(error => {
          console.error('Error al obtener el ID del profesor:', error);
          return of(null);
        }),
        shareReplay(1) // Cachea el valor para futuras llamadas
      );
    } else {
      console.error("No se pudo obtener el campo 'sub' del token.");
      return of(null);
    }
  }

  getEntidadId(): Observable<number | null> {
    if (this.entidadId !== null) {
      return of(this.entidadId);
    }

    const sub = this._tokenService.getSub();
    if (sub) {
      return this._entidadService.getEntidadByUser(sub).pipe(
        map((entidadUsuario: EntidadUsuario) => {
          if (entidadUsuario && entidadUsuario.id) {
            this.entidadId = entidadUsuario.id; // Asigna el ID de la entidad
            return this.entidadId;
          } else {
            console.error('No se encontró el campo "id" en la entidad del usuario.');
            return null;
          }
        }),
        catchError(error => {
          console.error('Error al obtener la entidad del usuario:', error);
          return of(null);
        }),
        shareReplay(1) // Cachea el valor para futuras llamadas
      );
    } else {
      console.error("No se pudo obtener el campo 'sub' del token.");
      return of(null);
    }
  }
  
  
}
