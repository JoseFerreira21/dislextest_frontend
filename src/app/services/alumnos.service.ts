import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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


}
