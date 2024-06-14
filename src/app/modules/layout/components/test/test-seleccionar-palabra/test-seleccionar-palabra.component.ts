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

  constructor(private testService: TestService) {}

  ngOnInit() {
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

  seleccionar(grupoIndex: number, palabraIndex: number): void {
    this.seleccion[grupoIndex] = palabraIndex;
    console.log(`Respuesta para el grupo ${grupoIndex + 1}: ${this.grupos[grupoIndex].palabra[palabraIndex]}`);
  }
}

