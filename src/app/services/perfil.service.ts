import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { Perfil } from '@models/perfil.model';
import { checkToken } from 'src/interceptors/token.interceptor';

import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  
  apiUrl = environment.API_URL;

  getEntidadPerfil(idEntidad: number): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}${idEntidad}`, {
      context: checkToken(),
    });
  }

  updateEntidadPerfil(idEntidad: number, modelo: Perfil): Observable<Perfil> {
    //console.log('Objeto entidad que recibira la Api');
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<Perfil>(
      `${this.apiUrl}${idEntidad}`,
      JSON.stringify(modelo),
      { headers: headers }
    );
  }
}
