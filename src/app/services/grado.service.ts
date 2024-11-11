// grado.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Grado } from '@models/alumno.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class GradoService {
  
  apiUrl = environment.API_URL + '/grado';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getGrados(): Observable<Grado[]> {

    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<Grado[]>(this.apiUrl, {
      headers: headers,
    });
  
  }



}


