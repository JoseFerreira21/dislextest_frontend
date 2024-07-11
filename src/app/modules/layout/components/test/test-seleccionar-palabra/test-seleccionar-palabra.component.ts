import { Component, OnInit } from '@angular/core';
import { DiscriminacionPalabra } from '@models/discriminacion-palabras.model';
import { ResultadoEjercicio } from '@models/resultados-ejercicio.model';
import { ResultadoItem, ResultadoItemRespuesta } from '@models/resultados-item.model';
import { ResultadosService } from '@services/resultados.service';
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
  colores: string[] = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

  resultadoTest: ResultadoItem;
  resultadoItemId: number = 0;
  respuestas: ResultadoEjercicio[] = [];

  constructor(private testService: TestService, private resultadosService: ResultadosService) {
    this.resultadoTest = {
      AreaId: 0,
      indicador: '',
      observacion: '',
      pObtenido: 0,
      ResultadoTestId: 0
    };}

  ngOnInit() {
    this.cargarPalabras();
  }

  cargarPalabras() {
    this.testService.getDiscriminacionPalabra().subscribe({
      next: (data) => {
        this.grupos = data;
      },
      error: (error) => console.error('Error al consultar al service:', error)
    });
  }

  // guardar() {
  //   this.grupos.forEach((grupo, index) => {
  //     grupo.palabras.forEach(palabra => {
  //       if (palabra.estado && grupo.respuesta === palabra.opcion) {
  //         this.puntos++;
  //       }
  //     });
  //   });
  //   console.log('Puntaje total del ejercicio 2: ', this.puntos);
  // }

  public guardar = async (testId: number) => {
    console.log(this.grupos);
    for (let index = 0; index < this.grupos.length; index++) {
      const element = this.grupos[index];
      console.log('La respuesta correcta: ', element.respuesta);
      this.resultadoTest.AreaId = element.areaId;
      this.resultadoTest.ResultadoTestId = testId;
      let resultado: ResultadoEjercicio = {
        respuestaRespondida: '',
        acierto: false,
        ejercicioId: this.grupos[index].ejercicioId,
        ejercicioOpcionesId: element.ejercicioOpcionesId,
        alumnoId: 1,
        resultadoItemId: 0
      };
      for (let j = 0; j < this.grupos[index].palabras.length; j++) {
        const element = this.grupos[index].palabras[j];
        // let resultado: ResultadoEjercicio = {
        //   respuestaRespondida: element.opcion,
        //   acierto: false,
        //   ejercicioId: this.grupos[index].ejercicioId,
        //   ejercicioOpcionesId: element.ejercicioOpcionesId,
        //   alumnoId: 1,
        //   resultadoItemId: 0
        // };

        if (element.estado) {
          resultado.respuestaRespondida = element.opcion
        }

        if (element.estado && this.grupos[index].respuesta == element.opcion) {
          console.log('seleccionado correcto', element);
          this.puntos++
          resultado.acierto = true;
        }

      }
      this.respuestas.push(resultado);
    }
    this.resultadoTest.pObtenido = this.puntos;
    console.log('ResultadoRespuestas: ', this.respuestas);
    console.log('Puntaje total del ejercicio 2: ', this.puntos);
    await this.guardarResultado();
  }

  async guardarResultado() {

    this.resultadosService.postResultadoItem(this.resultadoTest).subscribe({
      next: (response: ResultadoItemRespuesta) => {
        console.log('Respuesta del insert de resultado 2: ', response);
        this.resultadoItemId = response.id;
        this.guardarResultadoEjercicio()
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });

  }

  guardarResultadoEjercicio() {
    for (let index = 0; index < this.respuestas.length; index++) {
      const element = this.respuestas[index];
      element.resultadoItemId = this.resultadoItemId;
      this.resultadosService.postResultadoEjercicio(element).subscribe({
        next: (response) => {
          console.log('datos insertados del ejercicio 2: ', response);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    }
  }


  seleccionar(grupoIndex: number, palabra: String, palabraIndex: number): void {
    const grupo = this.grupos[grupoIndex];
    grupo.palabras.forEach((palabra, index) => {
      palabra.estado = (index === palabraIndex);
    });
    this.seleccion[grupoIndex] = palabraIndex;
  }

  getGrupoClasses(i: number) {
    const colorClass = this.colores[i % this.colores.length];
    return colorClass;
  }
}
