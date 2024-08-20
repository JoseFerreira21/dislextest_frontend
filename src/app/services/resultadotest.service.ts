import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<ResultadoTest[]>(`${this.apiUrl}/resultadotest/profesor/${idProfesor}`, {
      context: checkToken(),
    });
  }

  getDetallesEjercicio(alumnoId: number, itemId: number): Observable<ResultadoEjercicio[]> {
    return this.http.get<ResultadoEjercicio[]>(`${this.apiUrl}/resultadoejercicio/${alumnoId}/${itemId}`, {
      context: checkToken(),
    });
  }
}
