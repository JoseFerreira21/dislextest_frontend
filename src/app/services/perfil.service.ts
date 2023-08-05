import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { Perfil } from '@models/perfil.model';
import { checkToken } from 'src/interceptors/token.interceptor';

import { AuthService } from '@services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  user$ = this.authService.user$;
  apiUrl = environment.API_URL;

  getPerfilEntidad() {
    return this.http.get<Perfil[]>(
      `${this.apiUrl}/entidad/usuario/${this.user$.value?.id}`,
      {
        context: checkToken(),
      }
    );
  }

  postPerfilProfesor(entidad: any) {
    //console.log('Objeto profesor que recibira la Api');
    //console.log(entidad);
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/entidad`, JSON.stringify(entidad), {
      headers: headers,
    });
  }
}
