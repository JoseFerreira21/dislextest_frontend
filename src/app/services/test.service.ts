import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TestService {

  private _url: string = `${environment.API_URL}`;

  constructor(private http: HttpClient) {
    console.log('Se conecta al service');
  };

  getUser() {
    return this.http.get(`${this._url}UserProfile/`);
  };

  getUserId(id: number) {
    return this.http.get(`${this._url}UserProfile/${id}`);
  };

  getAlumnoProfesor(doc: string) {
    return this.http.get(`${this._url}AlumnoDelProfesor/${doc}`);
  };

  getResultadoTest() {
    return this.http.get(`${this._url}Vista_Resultados/`);
  }

  getResultadoItemList() {
    return this.http.get(`${this._url}ResultadoItemList/`);
  }

  postResultadoTest(resultadoTest: any) {
    console.log('Lo que recibira la API: ', resultadoTest );
    const headers =  { 'content-type': 'application/json'}  
    return this.http.post(`${this._url}ResultadoTest/`, resultadoTest, {'headers': headers});
  };

  
  postResultadoItem(item: any) {
    console.log('Lo que recibira la API: ', item );
    const headers =  { 'content-type': 'application/json'}  
    return this.http.post(`${this._url}ResultadoItemList/`, item, {'headers': headers});
  };
  
  putResultadoTest(resultadoTest: any, idAlumno: number) {
    console.log('Lo que recibira la API para el PUT: ', resultadoTest );
    const headers =  { 'content-type': 'application/json'}  
    return this.http.put(`${this._url}ResultadoTest/${idAlumno}`, resultadoTest, {'headers': headers});
  };

  postAlumno(alumno: any) {
    console.log('Objeto alumno que recibira la Api');
    const headers =  { 'content-type': 'application/json'};
    return this.http.post(`${this._url}Alumno/`, alumno, {'headers': headers});
  };

  postEntidad(entidad: any) {
    console.log('Objeto alumno que recibira la Api');
    const headers =  { 'content-type': 'application/json'};
    return this.http.post(`${this._url}Entidad/`, entidad, {'headers': headers});
  }

  getEntidad(doc: string) {
    return this.http.get(`${this._url}Entidad/${doc}`);
  }

  getProfesor(id: number) {
    return this.http.get(`${this._url}Profesor/${id}`);
  }

  postAluProfe(aluProfe: any) {
    console.log('Objeto alumno que recibira la Api');
    const headers =  { 'content-type': 'application/json'};
    return this.http.post(`${this._url}AluProfe/`, aluProfe, {'headers': headers});
  }

  getAlumnos() {
    return this.http.get(`${this._url}Alumno/`);

  }



}
