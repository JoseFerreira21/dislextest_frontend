import { Component, OnInit, HostListener } from '@angular/core';
import { TestService } from '@services/test.service';
import { ResultadosService } from '@services/resultados.service';
import { MatDialog } from '@angular/material/dialog';
import { TextToSpeechService } from '@services/text-to-speech.service';
import { SoundService } from '@services/sound.service';
import { SharedService } from '@services/shared.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { ModalAvisoComponent } from '../../dialogs/modal-aviso/modal-aviso.component';
import {
  ResultadoItem,
  ResultadoItemRespuesta,
} from '@models/resultados-item.model';
import { ResultadoEjercicio } from '@models/resultados-ejercicio.model';
import { Areas } from '@models/areas.model';
import { IzquierdaDerecha } from '@models/izquierda-derecha.model';

@Component({
  selector: 'app-test-izquierda-derecha',
  templateUrl: './test-izquierda-derecha.component.html',
  styleUrls: ['./test-izquierda-derecha.component.scss'],
})
export class TestIzquierdaDerechaComponent implements OnInit {
  instruccion: string = '';
  ejercicios: IzquierdaDerecha[] = [];
  izquierda: string[] = [];
  derecha: string[] = [];
  posicion: string[] = [];

  alumnoId: number;
  areas: Areas[] = []; // Array para almacenar las áreas cargadas
  resultadoItemId: number = 0;
  respuestas: ResultadoEjercicio[] = [];
  resultadoTest: ResultadoItem;
  puntaje: number = 0;
  imagenesEjercicio: string[] = [];
  mostrarImagen: boolean = false;
  rutaImagenCheck: string = 'assets/images/';
  porcentajeRespuesta: number = 0;
  inactivityTimer: any;
  inactivityTimerActive: boolean = false; // Nueva bandera para controlar el temporizador
  seleccionCompleta: boolean = false;
  // Variables para el tiempo empleado
  startTime: number = 0;
  elapsedTime: number = 0;
  interval: any;
  tiempoEmpleado: number = 0;

  constructor(
    private testService: TestService,
    private resultadosService: ResultadosService,
    private dialog: MatDialog,
    private textToSpeechService: TextToSpeechService,
    private soundService: SoundService,
    private sharedService: SharedService
  ) {
    this.resultadoTest = {
      AreaId: 0,
      indicador: '',
      observacion: '',
      tiempoEmpleado: 0,
      pObtenido: 0,
      ResultadoTestId: 0,
    };
    this.alumnoId = this.sharedService.getAlumnoId(); // Obtener el alumnoId del servicio compartido
  }

  async ngOnInit() {
    try {
      this.puntaje = 0;
      this.startTimer();
      this.inactivityTimerActive = false; // Desactivar inicialmente el temporizador de inactividad

      // Cargar áreas y LetrasDesordenadas en paralelo
      await Promise.all([this.cargarAreas(), this.cargarIzquierdaDerecha()]);

      // Combinar palabras y áreas una vez que ambas se hayan cargado
      this.unirPalabrasConAreas();
      this.cargarImagenes();
      this.actualizarInstruccion();

      this.izquierda = [];
      this.derecha = [];
    } catch (error) {
      console.error('Error en ngOnInit: ', error);
    }
  }

  // Iniciar el temporizador de tiempo empleado en el test/ejercicio
  startTimer() {
    this.startTime = Date.now();
    this.interval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.tiempoEmpleado = Math.floor(this.elapsedTime / 1000); // Segundos transcurridos
    }, 1000);
  }

  actualizarInstruccion() {
    if (this.ejercicios && this.ejercicios.length > 0) {
      const primerEjercicio = this.ejercicios[0];
      const segundoEjercicio = this.ejercicios[1];
      const palabra1 = primerEjercicio.palabra;
      const posicion1 = primerEjercicio.posicion;
      const palabra2 = segundoEjercicio.palabra;
      const posicion2 = segundoEjercicio.posicion;

      const articulo1 = this.obtenerArticuloCorrecto(palabra1);
      const articulo2 = this.obtenerArticuloCorrecto(palabra2);

      // Actualizar el texto de la instrucción de acuerdo con los ejercicios
      this.instruccion = `Arrastra ${articulo1} ${palabra1} a la posición ${posicion1} y ${articulo2} ${palabra2} a la posición ${posicion2} de la casa.`;
      this.textToSpeechService.speak(
        `Arrastra ${articulo1} ${palabra1} a la posición ${posicion1}, y la  ${palabra2} a la posición  ${posicion2} de la casa.`
      );
    }
  }

  escucharInstruccion() {
    // Asegurarse de que 'ejercicios' tiene datos
    if (this.ejercicios && this.ejercicios.length > 0) {
      const primerEjercicio = this.ejercicios[0];
      const segundojercicio = this.ejercicios[1];
      const palabra1 = primerEjercicio.palabra;
      const posicion1 = primerEjercicio.posicion;
      const palabra2 = segundojercicio.palabra;
      const posicion2 = segundojercicio.posicion;

      // Validar el artículo correcto
      const articulo = this.obtenerArticuloCorrecto(primerEjercicio.palabra);

      this.textToSpeechService.speak(
        `Arrastra ${articulo} ${palabra1} a la posición ${posicion1}, y la  ${palabra2} a la posición  ${posicion2} de la casa.`
      );
    }
  }

  // Función para obtener el artículo correcto
  obtenerArticuloCorrecto(palabra: string): string {
    const palabrasMasculinas = ['auto']; 
    if (palabrasMasculinas.includes(palabra.toLowerCase())) {
      return 'el';
    }
    return 'la';
  }

  // Calcular minutos y segundos para mostrar en el HTML
  getFormattedTime() {
    const minutes = Math.floor(this.tiempoEmpleado / 60);
    const seconds = this.tiempoEmpleado % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  async cargarAreas() {
    return new Promise<void>((resolve, reject) => {
      this.testService.getAreas().subscribe({
        next: (data: Areas[]) => {
          this.areas = data;
          //console.log('Áreas cargadas:', this.areas);
          resolve();
        },
        error: (error) => {
          //console.error('Error al cargar las áreas:', error);
          reject(error);
        },
      });
    });
  }

  async cargarIzquierdaDerecha(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.testService.geIzquierdaDerecha().subscribe({
        next: (data) => {
          this.ejercicios = data;

          // Distribuir las imágenes en izquierda y derecha según la propiedad 'posicion'
          this.ejercicios.forEach((ejercicio) => {
            if (ejercicio.posicion === 'izquierda') {
              this.izquierda.push(ejercicio.palabra); 
            } else if (ejercicio.posicion === 'derecha') {
              this.derecha.push(ejercicio.palabra); 
            }
          });

          resolve();
        },
        error: (error) => reject(error),
      });
    });
  }

  unirPalabrasConAreas() {
    this.ejercicios.forEach((ejercicios) => {
      const area = this.areas.find((area) => area.id === ejercicios.areaId);
      if (area) {
        ejercicios.pEsperado = area.pEsperado;
        ejercicios.pMinimo = area.pMinimo;
        ejercicios.observacionR = area.observacionR;
        ejercicios.observacionSR = area.observacionSR;
        //console.log(`Observaciones para areaId ${area.id}: R - ${area.observacionR}, SR - ${area.observacionSR}`);
      }
    });

    //console.log('Palabras después de combinar con áreas:', this.ejercicios);
  }

  onDrop(event: CdkDragDrop<string[]>, origen: string) {
    const destino = event.container.id; // 'leftDropzone', 'rightDropzone' o 'draggable-container'
  
    //console.log('Zona de origen:', origen);
    //console.log('Zona de destino:', destino);
  
    // Si el ítem se mueve dentro del mismo contenedor, reorganizar con `moveItemInArray`
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Mover el ítem entre contenedores con `transferArrayItem`
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  
    // Actualizar las listas de acuerdo con la zona objetivo
    if (destino === 'leftDropzone') {
      // Visualmente en la derecha
      this.derecha = event.container.data;
      //console.log('Imágenes en derecha (visual izquierda):', this.derecha);
    } else if (destino === 'rightDropzone') {
      // Visualmente en la izquierda
      this.izquierda = event.container.data;
      //console.log('Imágenes en izquierda (visual derecha):', this.izquierda);
    } else if (destino === 'draggable-container') {
      this.imagenesEjercicio = event.container.data;
      //console.log('Imágenes en inicial:', this.imagenesEjercicio);
    }
  
    // Reproducir el sonido de selección
    this.soundService.ClickSeleccionarSonido();
  
    // Verificar si la selección está completa después de cada movimiento
    this.verificarSeleccionCompleta();
  }
  

  verificarSeleccionCompleta() {
    // Verificar si ambas zonas (izquierda y derecha) tienen al menos una imagen
    this.seleccionCompleta = this.izquierda.length === 1 && this.derecha.length === 1;
  
    if (this.seleccionCompleta) {
      this.inactivityTimerActive = true; // Activar el temporizador
      this.startInactivityTimer();
      //console.log('Ejercicio completado. Evaluando respuestas...');
  
      // Llamar a evaluarRespuestas para calcular el puntaje
      this.evaluarRespuestas();
    }
  }
  
  evaluarRespuestas() {
    let puntajeTemporal = 0;
  
    // Evaluar la respuesta en la zona derecha
    const esDerechaCorrecta = this.derecha.some(img =>
      this.ejercicios.some(ej => img.includes(ej.palabra) && ej.respuesta === 'derecha')
    );
  
    // Evaluar la respuesta en la zona izquierda
    const esIzquierdaCorrecta = this.izquierda.some(img =>
      this.ejercicios.some(ej => img.includes(ej.palabra) && ej.respuesta === 'izquierda')
    );
  
    // Incrementar el puntaje por cada respuesta correcta
    if (esDerechaCorrecta && esIzquierdaCorrecta) {
      puntajeTemporal++;
    }
  
    this.puntaje = puntajeTemporal; // Asignar el puntaje calculado
  
    //console.log(`Puntaje obtenido: ${this.puntaje} de 1`);
  
  }
  
  respuestaPalabra(element: IzquierdaDerecha): string {
    let resultado: ResultadoEjercicio = {
      respuestaRespondida: '',
      acierto: false,
      ejercicioId: element.ejercicioId,
      ejercicioOpcionesId: element.ejercicioOpcionesId,
      alumnoId: this.alumnoId,
      resultadoItemId: 0,
    };
  
    // Función para obtener el nombre del archivo sin la ruta
    const obtenerNombreArchivo = (ruta: string) => ruta.split('/').pop()?.split('.')[0];
  
    // Depuración: Ver el estado de las listas y la palabra que se está evaluando
    //console.log("Evaluando palabra:", element.palabra);
    //console.log("Lista izquierda (actual):", JSON.stringify(this.izquierda.map(obtenerNombreArchivo)));
    //console.log("Lista derecha (actual):", JSON.stringify(this.derecha.map(obtenerNombreArchivo)));
  
    // Intentar encontrar la palabra en las listas y asignar respuestaRespondida
    if (this.izquierda.map(obtenerNombreArchivo).includes(element.palabra)) {
      resultado.respuestaRespondida = 'izquierda';
      //console.log(`La palabra ${element.palabra} está en la lista izquierda.`);
    } else if (this.derecha.map(obtenerNombreArchivo).includes(element.palabra)) {
      resultado.respuestaRespondida = 'derecha';
      //console.log(`La palabra ${element.palabra} está en la lista derecha.`);
    }
  
    // Verificar si la respuesta del alumno es correcta
    if (element.respuesta === resultado.respuestaRespondida) {
      resultado.acierto = true;
      element.validez = this.rutaImagenCheck + 'correcto.png'; // Asignar imagen de correcto
    } else {
      element.validez = this.rutaImagenCheck + 'incorrecto.png'; // Asignar imagen de incorrecto
    }
  
    // Añadir el resultado al array de respuestas
    this.respuestas.push(resultado);
  
    // Ver el resultado final antes de devolverlo
    //console.log("Resultado final de la respuesta:", resultado);
    return resultado.respuestaRespondida;
  }
  
  
  async guardar(testId: number): Promise<void> {
    this.mostrarImagen = true;
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.cancelarInactivityTimer();
        this.resultadoTest.ResultadoTestId = testId;
        this.resultadoTest.tiempoEmpleado = this.tiempoEmpleado;

        for (let element of this.ejercicios) {
          this.resultadoTest.AreaId = element.areaId;
          this.respuestaPalabra(element);
          if (element.pMinimo !== undefined && element.observacionSR && element.observacionR) {
            this.resultadoTest.indicador = this.puntaje > element.pMinimo ? 'SR' : 'R';
            this.resultadoTest.observacion = this.puntaje > element.pMinimo ? element.observacionSR : element.observacionR;
          }
        }

        this.resultadoTest.pObtenido = this.puntaje;

        let modalValue = this.puntaje === 1 ? 60 : 10;
        if (this.puntaje === 1) {
          this.soundService.AplausoSonido();
        } else {
          this.soundService.EquivocadoSonido();
        }

        this.mostrarImagenes();

        setTimeout(async () => {
          await this.guardarResultado();
          this.mostrarMensaje(modalValue)
            .then(() => {
              resolve();
            })
            .catch(reject);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  }

  mostrarMensaje(value: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const dialogRef = this.dialog.open(ModalAvisoComponent, {
        data: { value: value },
      });
      dialogRef.afterClosed().subscribe(() => resolve());
    });
  }
  
  async guardarResultado(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.resultadosService.postResultadoItem(this.resultadoTest).subscribe({
        next: (response: ResultadoItemRespuesta) => {
          this.resultadoItemId = response.id;
          this.guardarResultadoEjercicio()
            .then(resolve)
            .catch(reject);
        },
        error: (error) => {
          console.error('Error:', error);
          reject(error);
        },
      });
    });
  }
  
  async guardarResultadoEjercicio(): Promise<void> {
    const requests = this.respuestas.map((element) => {
      element.resultadoItemId = this.resultadoItemId;
      return this.resultadosService.postResultadoEjercicio(element).toPromise();
    });

    return Promise.all(requests)
      .then(() => {
        console.log('Todas las respuestas fueron guardadas correctamente.');
      })
      .catch((error) => {
        console.error('Error en guardarResultadoEjercicio:', error);
      });
  }

  cargarImagenes() {
    for (let i = 0; i < this.ejercicios.length; i++) {
      const element = this.ejercicios[i];
      const rutaImagen = 'assets/images/';
      //console.log('carga de imagenes: ', element.respuesta);
      this.imagenesEjercicio.push(rutaImagen + element.palabra + '.png');
    }
    //console.log('array de rutas: ', this.imagenesEjercicio);
  }

  mostrarImagenes() {
    this.mostrarImagen = true;
  }

  validacionPosicionImagenChek(img: string): string {
    const palabra = this.ejercicios.find(ej => img.includes(ej.palabra));
    return palabra ? palabra.validez : '';
  }
  
  // Método para iniciar el temporizador de inactividad
  startInactivityTimer() {
    if (!this.inactivityTimerActive) {
      return;
    }

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => {
      this.textToSpeechService.speak(
        'Favor, oprima el botón siguiente si ya terminó los ejercicios'
      );
    }, 10000); // 10 segundos
  }

  // Método para cancelar el temporizador de inactividad
  cancelarInactivityTimer() {
    this.inactivityTimerActive = false; // Desactivar el temporizador

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

  @HostListener('window:click')
  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  resetInactivityTimer() {
    if (!this.inactivityTimerActive) {
      return;
    }

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.startInactivityTimer();
    }
  }
}
