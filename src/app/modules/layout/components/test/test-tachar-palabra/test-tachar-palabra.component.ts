import { Component } from '@angular/core';
import { OpcionesPalabras, TacharPalabra } from '@models/tachar-palabra.model';

@Component({
  selector: 'app-test-tachar-palabra',
  templateUrl: './test-tachar-palabra.component.html',
  styleUrls: ['./test-tachar-palabra.component.scss']
})
export class TestTacharPalabraComponent {
  opcionesGrupo: TacharPalabra[] = [
    {
      buscar: 'gusano',
      opcionesPalabras: [
        { texto: 'golazo', estado: false },
        { texto: 'guisado', estado: false },
        { texto: 'gusano', estado: false },
        { texto: 'goma', estado: false }
      ]
    },
    {
      buscar: 'tortuga',
      opcionesPalabras: [
        { texto: 'tierra', estado: false },
        { texto: 'tienda', estado: false },
        { texto: 'tortuga', estado: false },
        { texto: 'torunda', estado: false }
      ]
    }
  ];

  seleccionarRespuesta(opcionesGrupo: TacharPalabra, palabra: OpcionesPalabras): void {
    opcionesGrupo.opcionesPalabras.forEach(option => option.estado = false);
    palabra.estado = true;
  }
}