import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { switchMap, tap } from 'rxjs/operators';
import { TokenService } from '@services/token.service';
import { ResponseLogin } from '@models/auth.model';

import { User } from '@models/user.model';
import { BehaviorSubject } from 'rxjs';
import { checkToken } from 'src/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.API_URL;

  user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string) {
    return this.http
      .post<ResponseLogin>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response: { access_token: string }) => {
          this.tokenService.saveToken(response.access_token);
        })
      );
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/register`, {
      name,
      email,
      password,
    });
  }

  registerAndLogin(name: string, email: string, password: string) {
    return this.register(name, email, password).pipe(
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

  getProfile() {
    //const token = this.tokenService.getToken();
    //console.log(token);
    return this.http
      .get<User>(`${this.apiUrl}/auth/profile`, { context: checkToken() })
      .pipe(
        tap((user) => {
          this.user$.next(user);
        })
      );
  }

  logout() {
    this.tokenService.removeToken();
  }
}
