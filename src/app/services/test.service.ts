import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { TokenService } from '@services/token.service';
import { Palabra } from '@models/formar-palabras.model';
import { DiscriminacionPalabra } from '@models/discriminacion-palabras.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  apiUrlTest = environment.API_URL + '/test/';
  apiUrlDiccionario = environment.API_URL + '/diccionario/';

  constructor(private http: HttpClient, 
              private tokenService: TokenService) {
  };

  getObtenerPalabras(): Observable<Palabra[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    
    return this.http.get<Palabra[]>(`${this.apiUrlDiccionario}formar-palabras`, { headers: headers });
  }

  getDiscriminacionPalabra(): Observable<DiscriminacionPalabra[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    
    return this.http.get<DiscriminacionPalabra[]>(`${this.apiUrlDiccionario}discriminacion-visual-v2`, { headers: headers });
  }

}
