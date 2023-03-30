import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { Alumnos } from '@models/alumnos.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  apiUrl = environment.API_URL;

  getAlumnos() {
    const token = this.tokenService.getToken();
    console.log(token);
    return this.http.get<Alumnos[]>(`${this.apiUrl}/alumno`, {
      headers :{
        Authorization: `Bearer ${token}`,
      }
    });
  }


  postAlumno(entidad: any) {
    console.log('Objeto alumno que recibira la Api');
    console.log(entidad);
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      'Authorization': `Bearer ${token}`})
    
    return this.http.post(`${this.apiUrl}/entidad`, JSON.stringify(entidad), {headers: headers});   
  }


}
