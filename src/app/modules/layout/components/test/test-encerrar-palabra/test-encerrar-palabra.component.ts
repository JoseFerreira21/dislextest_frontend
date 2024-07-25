import { Component } from '@angular/core';
import { EncerrarPalabras } from '@models/encerrar-palabra.model';

@Component({
  selector: 'app-test-encerrar-palabra',
  templateUrl: './test-encerrar-palabra.component.html',
  styleUrls: ['./test-encerrar-palabra.component.scss']
})
export class TestEncerrarPalabraComponent {

  palabras: EncerrarPalabras[] = [
    {
      respuesta: 'Elefante',
      opciones: [
        {
          palabra: 'efalente',
          estado: false,
        },
        {
          palabra: 'enlefante',
          estado: false,
        },
        {
          palabra: 'elefante',
          estado: false,
        }
      ]
    },
    {
      respuesta: 'Tigre',
      opciones: [
        {
          palabra: 'tgrie',
          estado: false,
        },
        {
          palabra: 'tigre',
          estado: false,
        },
        {
          palabra: 'tiger',
          estado: false,
        }
      ]
    }
  ];
  colores: string[] = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
  seleccion: { [key: number]: number } = {};


  seleccionar(grupoIndex: number, palabra: string, palabraIndex: number): void {
    const grupo = this.palabras[grupoIndex];
    grupo.opciones.forEach((opcion, index) => {
      opcion.estado = (index === palabraIndex); // Asegúrate de agregar la propiedad 'estado' en la interfaz Opcion
    });
    this.seleccion[grupoIndex] = palabraIndex;
  }

  getGrupoClasses(i: number) {
    const colorClass = this.colores[i % this.colores.length];
    return colorClass;
  }

}
