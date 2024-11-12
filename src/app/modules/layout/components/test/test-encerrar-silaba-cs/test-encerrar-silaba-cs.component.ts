import { Component, OnInit, HostListener } from '@angular/core';
import { TestService } from '@services/test.service';
import { ResultadosService } from '@services/resultados.service';
import { MatDialog } from '@angular/material/dialog';
import { TextToSpeechService } from '@services/text-to-speech.service';
import { SoundService } from '@services/sound.service';
import { ModalAvisoComponent } from '../../dialogs/modal-aviso/modal-aviso.component';
import {
  ResultadoItem,
  ResultadoItemRespuesta,
} from '@models/resultados-item.model';
import { ResultadoEjercicio } from '@models/resultados-ejercicio.model';

import { SharedService } from '@services/shared.service';
import { Areas } from '@models/areas.model';
import { EncerrarSilabaConcienciaSilabica } from '@models/encerrar-silaba-consiencia-silabica.model';

@Component({
  selector: 'app-test-encerrar-silaba-cs',
  templateUrl: './test-encerrar-silaba-cs.component.html',
  styleUrls: ['./test-encerrar-silaba-cs.component.scss'],
})
export class TestEncerrarSilabaCsComponent implements OnInit {
  ejercicios: EncerrarSilabaConcienciaSilabica[] = [];
  respuestasSeleccionadas: { [index: number]: string } = {};
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

      // Cargar áreas y ejercicios en paralelo
      await Promise.all([
        this.cargarAreas(),
        this.cargarEncerrarSilabaConcienciaSilabica(),
      ]);

      // Combinar palabras y áreas una vez que ambas se hayan cargado
      this.unirPalabrasConAreas();

      this.cargarImagenes();
      this.textToSpeechService.speak(
        'Encierra la sílaba que falta, dando click en ella'
      );
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

  escucharInstruccion() {
    this.textToSpeechService.speak(
      'Encierra la sílaba que falta, dando click en ella'
    );
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

  async cargarEncerrarSilabaConcienciaSilabica(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.testService.getEncerrarSilabasConsienciaSilabica().subscribe({
        next: (data) => {
          this.ejercicios = data;
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

  seleccionar(opcion: string, indice: number): void {
    // Solo permitir una selección por índice
    this.respuestasSeleccionadas[indice] = opcion;
    this.soundService.ClickSeleccionarSonido();

    // Verificar si ya se han seleccionado todas las respuestas necesarias
    this.verificarSeleccionCompleta();
  }

  verificarSeleccionCompleta() {
    let seleccionCorrecta = true;
    let puntajeTemporal = 0;

    // Verificar si se han seleccionado todas las respuestas necesarias
    this.ejercicios.forEach((ejercicio, index) => {
      const respuestaSeleccionada = this.respuestasSeleccionadas[index];

      // Si no hay una respuesta seleccionada, se considera que no está completo
      if (!respuestaSeleccionada) {
        seleccionCorrecta = false;
        return; // Salir del ciclo si no hay selección en algún ejercicio
      }

      // Verificar si la respuesta seleccionada es correcta
      if (respuestaSeleccionada === ejercicio.respuesta) {
        puntajeTemporal++; // Incrementar el puntaje por cada respuesta correcta
      }
    });

    // Asignar el puntaje temporal
    this.puntaje = puntajeTemporal;

    // Si se han seleccionado respuestas para todos los ejercicios, consideramos que la selección está completa
    if (
      Object.keys(this.respuestasSeleccionadas).length ===
      this.ejercicios.length
    ) {
      this.seleccionCompleta = true;
    } else {
      this.seleccionCompleta = false;
    }

    // Si todas las respuestas han sido seleccionadas, iniciar el temporizador de inactividad y proceder con la evaluación
    if (this.seleccionCompleta) {
      this.inactivityTimerActive = true;
      this.startInactivityTimer();
    }
  }

  public guardar = async (testId: number) => {
    this.cancelarInactivityTimer(); // Cancelar el temporizador de inactividad

    // Recorrer los ejercicios y validar las respuestas
    for (let index = 0; index < this.ejercicios.length; index++) {
      const element = this.ejercicios[index];
      this.resultadoTest.AreaId = element.areaId;
      this.resultadoTest.ResultadoTestId = testId;
      this.resultadoTest.tiempoEmpleado = this.tiempoEmpleado; // Guardar el tiempo empleado

      const respuesta: ResultadoEjercicio = {
        respuestaRespondida: this.respuestasSeleccionadas[index],
        acierto: this.respuestasSeleccionadas[index] === element.respuesta,
        ejercicioId: element.ejercicioId,
        ejercicioOpcionesId: element.ejercicioOpcionesId,
        alumnoId: this.alumnoId,
        resultadoItemId: 0,
      };

      this.respuestas.push(respuesta); // Agregar a las respuestas

      // Verificar la observación basada en el puntaje mínimo
      if (
        element.pMinimo !== undefined &&
        element.observacionSR &&
        element.observacionR
      ) {
        this.resultadoTest.indicador =
          this.puntaje > element.pMinimo ? 'SR' : 'R';
        this.resultadoTest.observacion =
          this.puntaje > element.pMinimo
            ? element.observacionSR
            : element.observacionR;
      }

      // Siempre asigna la imagen de validez (correcto o incorrecto)
      element.validez =
        this.respuestasSeleccionadas[index] === element.respuesta
          ? this.rutaImagenCheck + 'correcto.png'
          : this.rutaImagenCheck + 'incorrecto.png';
    }

    this.resultadoTest.pObtenido = this.puntaje; // Asignar el puntaje obtenido

    // Mostrar feedback basado en el puntaje
    let modalValue: number;
    if (this.puntaje === 2) {
      modalValue = 60;
      this.soundService.AplausoSonido();
    } else if (this.puntaje === 1) {
      modalValue = 30;
      this.soundService.AnimoSonido();
    } else {
      modalValue = 10;
      this.soundService.EquivocadoSonido();
    }

    // Mostrar el modal después 0,5 segundo
    setTimeout(() => {
      this.mostrarMensaje(modalValue);
    }, 500);

    this.mostrarImagenes(); // Mostrar las imágenes después de evaluar
    await this.guardarResultado(); // Guardar el resultado
  };

  async guardarResultado() {
    this.resultadosService.postResultadoItem(this.resultadoTest).subscribe({
      next: (response: ResultadoItemRespuesta) => {
        this.resultadoItemId = response.id;
        this.guardarResultadoEjercicio();
      },
      error: (error) => {
        console.error('Error al guardar el resultado:', error);
      },
    });
  }

  guardarResultadoEjercicio() {
    if (this.respuestas.length === 0) {
      console.error('No hay respuestas para guardar');
      return;
    }

    for (let index = 0; index < this.respuestas.length; index++) {
      const element = this.respuestas[index];
      element.resultadoItemId = this.resultadoItemId;
      this.resultadosService.postResultadoEjercicio(element).subscribe({
        next: (response) => {
          //console.log('Resultado del ejercicio guardado:', response);
        },
        error: (error) => {
          console.error('Error al guardar el detalle del ejercicio:', error);
        },
      });
    }
  }

  mostrarMensaje(value: number) {
    this.dialog.open(ModalAvisoComponent, {
      data: { value: value },
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
