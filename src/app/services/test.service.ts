import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { TokenService } from '@services/token.service';


@Injectable({
  providedIn: 'root'
})
export class TestService {

  apiUrlTest = environment.API_URL + '/test/';
  apiUrlDiccionario = environment.API_URL + '/diccionario/';

  constructor(private http: HttpClient, 
              private tokenService: TokenService) {
  };

  

}
