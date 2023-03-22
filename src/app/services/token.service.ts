import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie} from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token: string){
    setCookie('token', token, { expires: 365, path: '/'});
  }

  getToken(){
    const token = getCookie('token');
    return token;
  }

  removeToken(){
    removeCookie('token');
  }
  
  //Guardar token JWT en local storage navegador
  /*
  saveToken(token: string){
    localStorage.setItem('token', token);
  }

  getToken(){
    const token = localStorage.getItem('token');
    return token;
  }

  removeToken(){
    localStorage.removeItem('token');
  }
  */
}
