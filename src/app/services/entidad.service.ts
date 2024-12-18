import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { TokenService } from '@services/token.service';

import { Observable } from 'rxjs';
import { Entidad, EntidadUsuario } from '../models/entidad.model';
import { checkToken } from 'src/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  apiUrl = environment.API_URL + '/entidad/';

  getEntidadPerfil(idEntidad: number): Observable<Entidad> {
    return this.http.get<Entidad>(`${this.apiUrl}${idEntidad}`, {
      context: checkToken(),
    });
  }

  getEntidadByUser(idUsuario: number): Observable<EntidadUsuario> {
    return this.http.get<EntidadUsuario>(`${this.apiUrl}usuario/${idUsuario}`, {
      context: checkToken(), // Si utilizas esta función para manejar el token
    });
  }
  
  getEntidadList(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(`${this.apiUrl}`, {
      context: checkToken(),
    });
  }

  createEntidad(modelo: Entidad): Observable<Entidad> {
    //console.log('Objeto entidad que recibira la Api');
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Entidad>(`${this.apiUrl}`, JSON.stringify(modelo), {
      headers: headers,
    });
  }

  updateEntidad(idEntidad: number, modelo: Entidad): Observable<Entidad> {
    //console.log('Objeto entidad que recibira la Api');
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<Entidad>(
      `${this.apiUrl}${idEntidad}`,
      JSON.stringify(modelo),
      { headers: headers }
    );
  }

  deleteEntidad(idEntidad: number): Observable<void> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.apiUrl}${idEntidad}`, {
      headers: headers,
    });
  }
}
