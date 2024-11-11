// institucion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Institucion } from '@models/alumno.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {
  
  apiUrl = environment.API_URL + '/institucion';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getInstituciones(): Observable<Institucion[]> {

    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<Institucion[]>(this.apiUrl , {
      headers: headers,
    });
  }
}
