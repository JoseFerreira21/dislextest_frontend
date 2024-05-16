import { Component } from '@angular/core';

@Component({
  selector: 'app-test-seleccionar-palabra',
  templateUrl: './test-seleccionar-palabra.component.html',
  styleUrls: ['./test-seleccionar-palabra.component.scss']
})
export class TestSeleccionarPalabraComponent {

  grupos = [
    { color: 'red', palabras: ['rtáon', 'ratón', 'rantó'], respuesta: 'ratón'},
    { color: 'blue', palabras: ['glloa', 'golla', 'gallo'], respuesta: 'gallo'},
    { color: 'green', palabras: ['conejo', 'cenojo', 'conjeo'], respuesta: 'conejo'},
    { color: 'purple', palabras: ['loen', 'leon', 'lnoe'], respuesta: 'loen'}
  ];

  seleccion: { [key: number]: number } = {};

  seleccionar(grupoIndex: number, palabraIndex: number): void {
    this.seleccion[grupoIndex] = palabraIndex;
    console.log(`Respuesta para el grupo ${grupoIndex + 1}: ${this.grupos[grupoIndex].palabras[palabraIndex]}`);
  }
}
