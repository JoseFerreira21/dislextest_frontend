import { Injectable } from '@angular/core';
import { ProfesorService } from '@services/profesor.service';
import { TokenService } from '@services/token.service';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private profesorId: number | null = null;

  constructor(
    private _tokenService: TokenService,
    private _profesorService: ProfesorService
  ) {}

  getProfesorId(): Observable<number | null> {
    if (this.profesorId !== null) {
      return of(this.profesorId);
    }

    const sub = this._tokenService.getSub();
    if (sub) {
      return this._profesorService.getProfesorId(sub).pipe(
        map(dataResponse => {
          if (dataResponse.length > 0) {
            this.profesorId = dataResponse[0].id;
            return this.profesorId;
          } else {
            console.error('El array de objetos está vacío.');
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
}
