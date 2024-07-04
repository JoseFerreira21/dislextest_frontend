import { Component, OnInit } from '@angular/core';
import { Palabra, Letra } from '@models/formar-palabras.model';
import { TestService } from '@services/test.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResultadoItem } from '@models/resultados-item.model';
import { ResultadosService } from '@services/resultados.service';
import { ModalAvisoComponent } from '../../modal-aviso/modal-aviso.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-test-formar-palabra',
  templateUrl: './test-formar-palabra.component.html',
  styleUrls: ['./test-formar-palabra.component.scss']
})
export class TestFormarPalabraComponent implements OnInit {
  palabras: Palabra[] = [];
  respuestas: string[] = [];
  resultadoTest: ResultadoItem;
  puntaje: number = 0;
  imagenesEjercicio: string[] = [];
  mostrarImagen: boolean = false;
  porcentajeRespuesta : number = 0;
  rutaImagenCheck: string = 'assets/images/';
  constructor(private testService: TestService, private resultadosService: ResultadosService, private dialog: MatDialog) {
    this.resultadoTest = {
      AreaId: 0,
      indicador: '',
      observacion: '',
      pObtenido: 0,
      ResultadoTestId: 0
    };
  }

  async ngOnInit() {
    try {
      await this.cargarPalabras();
      this.puntaje = 0;
      this.cargarImagenes();
    } catch (error) {
      console.error('Error en ngOnInit: ', error);
    }
  }
  seleccionarLetra(palabra: Palabra, letter: Letra) {
    if (!letter.estado) {
      const lugarLibre = this.buscarLugarLibre(palabra.letrasRespuesta);
      if (lugarLibre !== -1) {
        palabra.letrasRespuesta[lugarLibre] = { ...letter };
        letter.estado = true;
      }
    }
  }

  deSeleccionarLetra(palabra: Palabra, letter: Letra, index: number) {
    if (palabra.letrasRespuesta[index].letra === letter.letra) {
      palabra.letrasRespuesta[index] = { letra: '', estado: false };
      const originalLetter = palabra.letras.find(l => l.letra === letter.letra && l.estado);
      if (originalLetter) {
        originalLetter.estado = false;
      }
    }
  }

  buscarLugarLibre(letrasRespuesta: Letra[]): number {
    for (let index = 0; index < letrasRespuesta.length; index++) {
      if (letrasRespuesta[index].letra === '') {
        return index;
      }
    }
    return -1;
  }

  public guardar = (testId: number) => {
    this.mostrarImagenes();
    this.mostrarMensaje();
    console.log(this.palabras);
    console.log('Test del resultado guardado: ', testId);
    for (let index = 0; index < this.palabras.length; index++) {
      const element = this.palabras[index];
      this.resultadoTest.AreaId = element.areaId;
      this.resultadoTest.ResultadoTestId = testId;
      //this.resultadoTest.indicador = element.descripcionEjercicio;
      console.log(element.letras);
      console.log(this.aparicionAleatoria(element) + `-` + this.respuestaPalabra(element, element));
    }
    this.resultadoTest.ResultadoTestId = testId;
    this.resultadoTest.pObtenido = this.puntaje;

    console.log('Puntaje obtenido: ', this.puntaje);

    this.guardarResultado();
  }

  aparicionAleatoria(element: Palabra): string {
    let retorno = '';
    for (let index = 0; index < element.letras.length; index++) {
      const letter = element.letras[index].letra;
      retorno += letter;
    }
    return retorno;
  }

  respuestaPalabra(element: Palabra, opcionPalabra: Palabra): string {
    let retorno = '';
    for (let index = 0; index < element.letrasRespuesta.length; index++) {
      const letrasRespuesta = element.letrasRespuesta[index].letra;
      retorno += letrasRespuesta;
    }
    if (retorno == opcionPalabra.respuesta) {
      this.puntaje++;
      opcionPalabra.validez = this.rutaImagenCheck+'correcto.png';
    }else {
      opcionPalabra.validez = this.rutaImagenCheck+'incorrecto.png';
    }
    return retorno;
  }

  async cargarPalabras() {
    return new Promise<void>((resolve, reject) => {
      this.testService.getObtenerPalabras().subscribe({
        next: (data: Palabra[]) => {
          this.palabras = data;
          this.palabras.forEach(p => {
            p.letrasRespuesta = Array(p.letras.length).fill({ letra: '', estado: false });
          });
          console.log('Palabras del service: ', this.palabras);
          resolve();
        },
        error: (error) => {
          console.error('Error al consultar al service: ', error);
          reject(error);
        }
      });
    });
  }

  cargarImagenes() {
    console.log('llega?', this.palabras.length);
    for (let i = 0; i < this.palabras.length; i++) {
      const element = this.palabras[i];
      const rutaImagen = 'assets/images/';
      console.log('carga de imagenes: ', element.respuesta);
      this.imagenesEjercicio.push(rutaImagen+element.respuesta+'.jpg');
    }
    console.log('array de rutas: ', this.imagenesEjercicio);
  }

  mostrarImagenes() {
    this.mostrarImagen = true;
  }

  guardarResultado() {
    console.log('Resultado guardado de Formar Palabras.');
    this.resultadosService.postResultadoEjercicio(this.resultadoTest).subscribe({
      next: (response) => {
        console.log('datos insertados: ', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  mostrarMensaje() {
    this.dialog.open(ModalAvisoComponent, {
      data: { value: 50 }
    });;
  }

}

