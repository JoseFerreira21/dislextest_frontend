import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { environment } from '@environments/environment';
import { checkToken } from 'src/interceptors/token.interceptor';
import { Profesor } from '@models/profesor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  apiUrl = environment.API_URL;

  getProfesorId(idUsuario :number){
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Profesor>(`${this.apiUrl}/profesor/usuario/${idUsuario}`, { headers: headers,});
  }
}
