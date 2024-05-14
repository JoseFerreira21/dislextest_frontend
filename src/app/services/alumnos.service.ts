import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { checkToken } from 'src/interceptors/token.interceptor';
import { Entidad } from '../interfaces/entidad';
import { alumnoEntidad } from '../interfaces/alumnoEntidad';
import { Alumno } from '../interfaces/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(private http: HttpClient, 
             private tokenService: TokenService) {}

  apiUrl = environment.API_URL;

  getAlumnosDelProfesor(idProfesor :number) {
    return this.http.get<alumnoEntidad[]>(`${this.apiUrl}/alumno/profesor/${idProfesor}`, {context: checkToken()});
  }


  createAlumno(alumno: any) {
    //console.log('Objeto entidad que recibira la Api');
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Alumno>(`${this.apiUrl}/alumno/`, JSON.stringify(alumno), {
      headers: headers,
    });
  }
}
