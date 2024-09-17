import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { checkToken } from 'src/interceptors/token.interceptor';
import { Entidad } from '../models/entidad';
import { alumnoEntidad } from '../models/alumnoEntidad';
import { Alumno, CrearAlumnoDTO } from '../models/alumno';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  apiUrl = environment.API_URL;

  getAlumnosDelProfesor(idProfesor: number) {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<alumnoEntidad[]>(
      `${this.apiUrl}/alumno/profesor/${idProfesor}`,
      { context: checkToken() }
    );
  }

  getAlumnoByEntidadID(idEntidad: number) {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Alumno>(`${this.apiUrl}/alumno/entidad/${idEntidad}`, {
      context: checkToken(),
    });
  }

  createAlumno(alumno: CrearAlumnoDTO) {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Alumno>(
      `${this.apiUrl}/alumno/`,
      JSON.stringify(alumno),
      {
        headers: headers,
      }
    );
  }

  registrarAlumnosMasivos(alumnos: CrearAlumnoDTO[]) {
    return this.http.post('/api/alumnos/masivos', alumnos);
  }

  updateAlumno(id: number, alumno: Partial<Alumno>) {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<Alumno>(
      `${this.apiUrl}/alumno/${id}`,
      JSON.stringify(alumno),
      {
        headers: headers,
      }
    );
  }

  getAlumnoById(id: number) {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Alumno>(`${this.apiUrl}/alumno/${id}`, {
      headers: headers,
    });
  }
}
