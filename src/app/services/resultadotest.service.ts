import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { ResultadoTest } from '@models/resultadotest.model';
import { checkToken } from 'src/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ResultadoTestService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  apiUrl = environment.API_URL;

  getResultados() {
    return this.http.get<ResultadoTest[]>(`${this.apiUrl}/resultadotest`, {
      context: checkToken(),
    });
  }
}
