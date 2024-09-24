import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { ResultadoTest, ResultadoEjercicio  } from '@models/resultadotest.model';
import { checkToken } from 'src/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ResultadoTestService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  apiUrl = environment.API_URL;

  getResultados(idProfesor :number) : Observable<ResultadoTest[]>{
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ResultadoTest[]>(`${this.apiUrl}/resultadotest/profesor/${idProfesor}`, {
      headers: headers,
    });
  }

  getDetallesEjercicio(alumnoId: number, itemId: number): Observable<ResultadoEjercicio[]> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ResultadoEjercicio[]>(`${this.apiUrl}/resultadoejercicio/${alumnoId}/${itemId}`, {
      headers: headers,
    });
  }
}
