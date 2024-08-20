import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import jwt_decode, { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  saveToken(token: string) {
    setCookie('token', token, { expires: 365, path: '/' });
  }

  getToken() {
    const token = getCookie('token');
    return token;
  }

  removeToken() {
    removeCookie('token');
  }

  isValidToken() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decodeToken = jwt_decode<JwtPayload>(token);
    if (decodeToken && decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }

  getSub(){
    let token: string | undefined; 
    token = this.getToken();
    // Decodificar el token para obtener su contenido
    const decodedToken: any = jwt_decode(token || '');

    // Obtener el campo 'sub' del token
    const sub: number = decodedToken.sub;
    return sub;
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
