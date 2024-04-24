import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { Alumnos } from '@models/alumnos.model';
import { checkToken } from 'src/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  apiUrl = environment.API_URL;

  getAlumnosDelProfesor(idProfesor :number) {
    return this.http.get<Alumnos[]>(`${this.apiUrl}/alumno/${idProfesor}`, {context: checkToken()});
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

  updateAlumno(id: number, entidad: any) {
    console.log('Objeto alumno que recibira la Api');
    console.log(entidad);
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      'Authorization': `Bearer ${token}`})
    
    return this.http.put(`${this.apiUrl}/entidad/${id}`, JSON.stringify(entidad), {headers: headers});   
  }

  deleteAlumno(id: number) {
    console.log('Objeto alumno que recibira la Api');
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      'Authorization': `Bearer ${token}`})
    
    return this.http.delete(`${this.apiUrl}/entidad/${id}`, {headers: headers});   
  }


}
