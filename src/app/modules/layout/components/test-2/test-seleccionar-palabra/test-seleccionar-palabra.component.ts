import { Component, OnInit } from '@angular/core';
import { DiscriminacionPalabra } from '@models/discriminacion-palabras.model';
import { TestService } from '@services/test.service';
@Component({
  selector: 'app-test-seleccionar-palabra',
  templateUrl: './test-seleccionar-palabra.component.html',
  styleUrls: ['./test-seleccionar-palabra.component.scss']
})
export class TestSeleccionarPalabraComponent implements OnInit {
  grupos: DiscriminacionPalabra[] = [];
  seleccion: { [key: number]: number } = {};
  puntos: number = 0;
  constructor(private testService: TestService) { }

  ngOnInit() {
    console.log('llega 1?');
    this.cargarPalabras();
  }

  cargarPalabras() {
    this.testService.getDiscriminacionPalabra().subscribe({
      next: (data) => {
        this.grupos = data;
        console.log('Datos en el componente: ', this.grupos);
      },
      error: (error) => console.error('Error al consultar al service:', error)
    });
  }

  public guardar = () => {
    console.log(this.grupos);
    for (let index = 0; index < this.grupos.length; index++) {
      const element = this.grupos[index];
      console.log('La respuesta correcta: ', element.respuesta);
      for (let j = 0; j < this.grupos[index].palabras.length; j++) {
        const element = this.grupos[index].palabras[j];
        if (element.estado && this.grupos[index].respuesta == element.opcion) {
          console.log('seleccionado correcto', element);
          this.puntos++
        }
      }

    }
    console.log('Puntaje total del ejercicio 2: ', this.puntos);
  }

  seleccionar(grupoIndex: number, palabra: String, palabraIndex: number): void {

    const grupo = this.grupos[grupoIndex];

    const palabraSeleccionada = grupo.palabras[palabraIndex];
    console.log(`Respuesta para el grupo ${grupoIndex + 1}: ${palabraSeleccionada.opcion}`);

    grupo.palabras.forEach((palabra, index) => {
      palabra.estado = (index === palabraIndex);
    });

    this.seleccion[grupoIndex] = palabraIndex;
  }
}

