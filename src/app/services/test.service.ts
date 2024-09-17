import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { TokenService } from '@services/token.service';
import { Palabra } from '@models/formar-palabras.model';
import { DiscriminacionPalabra } from '@models/discriminacion-palabras.model';
import { TacharPalabraEstructura } from '@models/tachar-palabra.model';
import { Areas } from '@models/areas.model';
import { EncerrarPalabras } from '@models/encerrar-palabra.model';
import { EncontrarLetras } from '@models/encontrar-letra.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  apiUrlTest = environment.API_URL + '/test/';
  apiUrlDiccionario = environment.API_URL + '/diccionario/';
  apiUrlAreas = environment.API_URL + '/area';

  constructor(private http: HttpClient,
              private tokenService: TokenService) {
  };

  getAreas(): Observable<Areas[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });

    return this.http.get<Areas[]>(`${this.apiUrlAreas}`, { headers: headers });
  }
  
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
    //let datos: DiscriminacionPalabra[] = [];
    let datos:Observable<DiscriminacionPalabra[]> = this.http.get<DiscriminacionPalabra[]>(`${this.apiUrlDiccionario}discriminacion-visual-v2`, { headers: headers });
    //console.log('datos del service: ', datos);
     return this.http.get<DiscriminacionPalabra[]>(`${this.apiUrlDiccionario}discriminacion-visual`, { headers: headers });
  }

  getTacharPalabra(): Observable<TacharPalabraEstructura[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });

    return this.http.get<TacharPalabraEstructura[]>(`${this.apiUrlDiccionario}discriminacion-palabras`, { headers: headers });
  }

  getEncontrarLetraEnPalabra(): Observable<EncontrarLetras[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    return this.http.get<EncontrarLetras[]>(`${this.apiUrlDiccionario}encontrar-letras-en-palabras`, { headers: headers });
  }

  getEncerrarPalabras(): Observable<EncerrarPalabras[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    let datos:Observable<EncerrarPalabras[]> = this.http.get<EncerrarPalabras[]>(`${this.apiUrlDiccionario}encerrar-palabras`, { headers: headers });
    //console.log('datos del service: ', datos);
     return this.http.get<EncerrarPalabras[]>(`${this.apiUrlDiccionario}encerrar-palabras`, { headers: headers });
  }

}
