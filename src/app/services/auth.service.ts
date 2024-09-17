import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { switchMap, tap } from 'rxjs/operators';
import { TokenService } from '@services/token.service';
import { ResponseLogin } from '@models/auth.model';

import { User } from '@models/user.model';
import { BehaviorSubject } from 'rxjs';
import { checkToken } from 'src/interceptors/token.interceptor';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.API_URL;
  private user: any;
  token: string | undefined;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string) {
    return this.http
      .post<ResponseLogin>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.access_token);
          this.setUserFromToken(response.access_token); // Asegúrate de llamar esto para almacenar el usuario
        })
      );
  }

  register(name: string, email: string, password: string, role: string) {
    return this.http.post(`${this.apiUrl}/usuario`, {
      name,
      email,
      password,
      role,
    });
  }

  registerAndLogin(
    name: string,
    email: string,
    password: string,
    role: string
  ) {
    return this.register(name, email, password, role).pipe(
      switchMap(() => this.login(email, password))
    );
  }

  isAvailable(email: string) {
    //console.log(email);
    return this.http.post<{ isAvailable: boolean }>(
      `${this.apiUrl}/auth/is-available`,
      {
        email,
      }
    );
  }

  recovery(email: string) {
    return this.http.post(`${this.apiUrl}/auth/recovery`, {
      email,
    });
  }

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/auth/change-password`, {
      token,
      newPassword,
    });
  }

  logout() {
    this.tokenService.removeToken();
  }

  setUserFromToken(token: string) {
    this.token = this.tokenService.getToken();
    if (this.token) {
      this.user = jwt_decode(this.token);
      //console.log('Usuario decodificado desde el token:', this.user); // Añadir esto para depuración
    }
  }

  getUser() {
    this.token = this.tokenService.getToken();
    if (this.token) {
      this.user = jwt_decode(this.token);
      //console.log('Usuario obtenido desde el token:', this.user); // Añadir esto para depuración
    }
    return this.user;
  }
}
