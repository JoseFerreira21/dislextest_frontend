import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { ResultadoTest } from '@models/resultadotest.model';

@Injectable({
  providedIn: 'root'
})
export class ResultadoTestService {

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  apiUrl = environment.API_URL;

  getResultados() {
    const token = this.tokenService.getToken();
    console.log(token);
    return this.http.get<ResultadoTest[]>(`${this.apiUrl}/resultadotest`, {
      headers :{
        Authorization: `Bearer ${token}`,
      }
    });
  }


}
