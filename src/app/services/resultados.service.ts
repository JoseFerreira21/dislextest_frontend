import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { TokenService } from '@services/token.service';
import { ResultadoTest, ResultadoTestPost } from '@models/resultados.model';
import { ResultadoItem, ResultadoItemRespuesta } from '@models/resultados-item.model';
import { ResultadoEjercicio } from '@models/resultados-ejercicio.model';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {


 apiUrl = environment.API_URL;

  constructor(private http: HttpClient,
              private tokenService: TokenService) {
  };

  postResultadoTest(resultado: ResultadoTest): Observable<ResultadoTestPost> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ResultadoTestPost>(`${this.apiUrl}/resultadoTest/`, JSON.stringify(resultado), {
      headers: headers,
    });
  }

  

  putResultadoTest(id: number, resultado: ResultadoTest): Observable<ResultadoTestPost> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.put<ResultadoTestPost>(
      `${this.apiUrl}/resultadoTest/${id}`,
      JSON.stringify(resultado),
      { headers: headers }
    );
  }


  postResultadoItem(resultado: ResultadoItem):Observable<ResultadoItemRespuesta>{
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ResultadoItemRespuesta>(`${this.apiUrl}/resultadotestitem/`, JSON.stringify(resultado), {
      headers: headers,
    });
  }

  postResultadoEjercicio(resultado: ResultadoEjercicio){
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ResultadoItemRespuesta>(`${this.apiUrl}/resultadoejercicio/`, JSON.stringify(resultado), {
      headers: headers,
    });
  }

}
