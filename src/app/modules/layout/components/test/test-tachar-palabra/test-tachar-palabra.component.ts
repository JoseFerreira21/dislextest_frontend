import { Component, OnInit } from '@angular/core';
import { TacharPalabraEstructura } from '@models/tachar-palabra.model';
import { TestService } from '@services/test.service';

@Component({
  selector: 'app-test-tachar-palabra',
  templateUrl: './test-tachar-palabra.component.html',
  styleUrls: ['./test-tachar-palabra.component.scss']
})
export class TestTacharPalabraComponent {
  //? Se comenta la opcion con datos estaticos, una vez funcione con el service eliminar el bloque comentado
  // opcionesGrupo: TacharPalabra[] = [
  //   {
  //     buscar: 'gusano',
  //     opcionesPalabras: [
  //       { texto: 'golazo', estado: false },
  //       { texto: 'guisado', estado: false },
  //       { texto: 'gusano', estado: false },
  //       { texto: 'goma', estado: false }
  //     ]
  //   },
  //   {
  //     buscar: 'tortuga',
  //     opcionesPalabras: [
  //       { texto: 'tierra', estado: false },
  //       { texto: 'tienda', estado: false },
  //       { texto: 'tortuga', estado: false },
  //       { texto: 'torunda', estado: false }
  //     ]
  //   }
  // ];

  respuesta: String = '';


  opcionesGrupo: TacharPalabraEstructura[] = [];

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.cargarPalabras();
  }

  cargarPalabras() {
    this.testService.getTacharPalabra().subscribe({
      next: (data) => {
        this.opcionesGrupo = data;
        console.log('Resultado del service: ', this.opcionesGrupo);
      },
      error: (error) => console.error('Error al consultar al service para el ejercicio Tachar Palabra:', error)
    });
  }

  seleccionarRespuesta(opcion: TacharPalabraEstructura, palabra: string): void {
    // Desactivar todas las opciones primero
    this.opcionesGrupo.forEach(opt => opt.estado = false);

    // Activar la opción seleccionada y asignar la respuesta
    opcion.estado = true;
    this.respuesta = palabra;
    console.log('Entra');
}



}