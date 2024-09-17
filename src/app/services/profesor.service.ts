import { HttpClient } from '@angular/common/http';
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
    return this.http.get<Profesor>(`${this.apiUrl}/profesor/usuario/${idUsuario}`, {context: checkToken()});
  }
}
