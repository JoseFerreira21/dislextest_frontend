import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { TokenService } from '@services/token.service';
import { Palabra } from '@models/formar-palabras.model';
import { DiscriminacionPalabra } from '@models/discriminacion-palabras.model';
import { TacharPalabraEstructura } from '@models/tachar-palabra.model';
import { ResultadoTest, ResultadoTestPost } from '@models/resultados.model';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {

  //apiUrlTest = environment.API_URL + '/test/';
 // apiUrlDiccionario = environment.API_URL + '/diccionario/';
 apiUrl = environment.API_URL;

  constructor(private http: HttpClient,
              private tokenService: TokenService) {
  };

  // getObtenerPalabras(): Observable<Palabra[]> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${this.tokenService.getToken()}`
  //   });

  //   return this.http.get<Palabra[]>(`${this.apiUrlDiccionario}formar-palabras`, { headers: headers });
  // }

  postResultadoTest(resultado: ResultadoTest): Observable<ResultadoTestPost> {
    //console.log('Objeto entidad que recibira la Api');
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ResultadoTestPost>(`${this.apiUrl}/resultadoTest/`, JSON.stringify(resultado), {
      headers: headers,
    });
  }

}
