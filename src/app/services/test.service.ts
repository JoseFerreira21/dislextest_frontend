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
import { LetrasDesordenadas } from '@models/letras-desordenadas.model';
import { EncerrarSilabaConcienciaSilabica } from '@models/encerrar-silaba-consiencia-silabica.model';
import { ContarLetras } from '@models/contar-letras.model';
import { EncerrarSilabaConcienciaFonologica } from '@models/encerrar-silaba-conciencia-fonologica.model';
import { IzquierdaDerecha } from '@models/izquierda-derecha.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  apiUrlTest = environment.API_URL + '/test/';
  apiUrlDiccionario = environment.API_URL + '/diccionario/';
  apiUrlAreas = environment.API_URL + '/area';

  private areas: Areas[] = [];

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
    let datos:Observable<DiscriminacionPalabra[]> = this.http.get<DiscriminacionPalabra[]>(`${this.apiUrlDiccionario}discriminacion-visual`, { headers: headers });
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

  getLetrasDesordenadas(): Observable<LetrasDesordenadas[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    //let datos:Observable<LetrasDesordenadas[]> = this.http.get<LetrasDesordenadas[]>(`${this.apiUrlDiccionario}letras-desordenadas`, { headers: headers });
    //console.log('datos del service: ', datos);
     return this.http.get<LetrasDesordenadas[]>(`${this.apiUrlDiccionario}letras-desordenadas`, { headers: headers });
  }

  getEncerrarSilabasConsienciaSilabica(): Observable<EncerrarSilabaConcienciaSilabica[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    //let datos:Observable<EncerrarSilabaConcienciaSilabica[]> = this.http.get<EncerrarSilabaConcienciaSilabica[]>(`${this.apiUrlDiccionario}encerrar-silabas-conciencia-silabica`, { headers: headers });
    //console.log('datos del service: ', datos);
     return this.http.get<EncerrarSilabaConcienciaSilabica[]>(`${this.apiUrlDiccionario}encerrar-silabas-conciencia-silabica`, { headers: headers });
  }


  getContarLetras(): Observable<ContarLetras[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    //let datos:Observable<ContarLetras[]> = this.http.get<ContarLetras[]>(`${this.apiUrlDiccionario}contar-letras`, { headers: headers });
    //console.log('datos del service: ', datos);
     return this.http.get<ContarLetras[]>(`${this.apiUrlDiccionario}contar-letras`, { headers: headers });
  }

  getEncerrarSilabasConsienciaFonologica(): Observable<EncerrarSilabaConcienciaFonologica[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    //let datos:Observable<EncerrarSilabaConcienciaFonologica[]> = this.http.get<EncerrarSilabaConcienciaFonologica[]>(`${this.apiUrlDiccionario}encerrar-silabas-conciencia-fonologica`, { headers: headers });
    //console.log('datos del service: ', datos);
     return this.http.get<EncerrarSilabaConcienciaFonologica[]>(`${this.apiUrlDiccionario}encerrar-silabas-conciencia-fonologica`, { headers: headers });
  }

  geIzquierdaDerecha(): Observable<IzquierdaDerecha[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    //let datos:Observable<IzquierdaDerecha[]> = this.http.get<IzquierdaDerecha[]>(`${this.apiUrlDiccionario}encerrar-silabas-conciencia-fonologica`, { headers: headers });
    //console.log('datos del service: ', datos);
     return this.http.get<IzquierdaDerecha[]>(`${this.apiUrlDiccionario}izquierda-derecha`, { headers: headers });
  }

}
