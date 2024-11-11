import { Component, OnInit, HostListener } from '@angular/core';
import { Palabra, Letra } from '@models/formar-palabras.model';
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

@Component({
  selector: 'app-test-formar-palabra',
  templateUrl: './test-formar-palabra.component.html',
  styleUrls: ['./test-formar-palabra.component.scss'],
})
export class TestFormarPalabraComponent implements OnInit {
  alumnoId: number;
  palabras: Palabra[] = [];
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

      // Cargar áreas y palabras en paralelo
      await Promise.all([this.cargarAreas(), this.cargarPalabras()]);

      // Combinar palabras y áreas una vez que ambas se hayan cargado
      this.unirPalabrasConAreas();

      this.cargarImagenes();
      this.textToSpeechService.speak(
        'Observa la palabra y ordena los nombres de los animales, dando click en las letras.'
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

  // Calcular minutos y segundos para mostrar en el HTML
  getFormattedTime() {
    const minutes = Math.floor(this.tiempoEmpleado / 60);
    const seconds = this.tiempoEmpleado % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  escucharInstruccion() {
    this.textToSpeechService.speak(
      'Observa la palabra y ordena los nombres de los animales, dando click en las letras.'
    );
  }

  async cargarPalabras() {
    return new Promise<void>((resolve, reject) => {
      this.testService.getObtenerPalabras().subscribe({
        next: (data: Palabra[]) => {
          this.palabras = data;
          this.palabras.forEach((p) => {
            p.letrasRespuesta = Array(p.letras.length).fill({
              letra: '',
              estado: false,
            });
          });
          //console.log('Palabras del service: ', this.palabras);
          resolve();
        },
        error: (error) => {
          console.error('Error al consultar al service: ', error);
          reject(error);
        },
      });
    });
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
          console.error('Error al cargar las áreas:', error);
          reject(error);
        },
      });
    });
  }

  unirPalabrasConAreas() {
    this.palabras.forEach((palabra) => {
      const area = this.areas.find((area) => area.id === palabra.areaId);
      if (area) {
        palabra.pEsperado = area.pEsperado;
        palabra.pMinimo = area.pMinimo;
        palabra.observacionR = area.observacionR;
        palabra.observacionSR = area.observacionSR;
      }
    });

    //console.log('Palabras después de combinar con áreas:', this.palabras);
  }

  seleccionarLetra(palabra: Palabra, letter: Letra) {
    if (!letter.estado) {
      const lugarLibre = this.buscarLugarLibre(palabra.letrasRespuesta);
      if (lugarLibre !== -1) {
        palabra.letrasRespuesta[lugarLibre] = { ...letter };
        letter.estado = true;
      }
    }
    this.soundService.ClickSeleccionarSonido();

    // Verificar si la tarea está completa después de cada selección
    this.verificarSeleccionCompleta();
  }

  verificarSeleccionCompleta() {
    // Verifica si todas las palabras tienen todas las letras necesarias seleccionadas
    this.seleccionCompleta = this.palabras.every((palabra) =>
      palabra.letrasRespuesta.every((letra) => letra.letra !== '')
    );

    if (this.seleccionCompleta) {
      this.inactivityTimerActive = true; // Activar el temporizador
      this.startInactivityTimer();
    }
  }

  deSeleccionarLetra(palabra: Palabra, letter: Letra, index: number) {
    if (palabra.letrasRespuesta[index].letra === letter.letra) {
      palabra.letrasRespuesta[index] = { letra: '', estado: false };
      const originalLetter = palabra.letras.find(
        (l) => l.letra === letter.letra && l.estado
      );
      if (originalLetter) {
        originalLetter.estado = false;
      }
    }
    this.soundService.ClickDeseleccionarSonido();
  }

  buscarLugarLibre(letrasRespuesta: Letra[]): number {
    for (let index = 0; index < letrasRespuesta.length; index++) {
      if (letrasRespuesta[index].letra === '') {
        return index;
      }
    }
    return -1; // Indica que no hay lugares libres
  }

  public guardar = async (testId: number) => {
    //clearInterval(this.interval);

    // Cancelar el temporizador de inactividad cuando se guarda el resultado
    this.cancelarInactivityTimer();

    for (let index = 0; index < this.palabras.length; index++) {
      const element = this.palabras[index];
      this.resultadoTest.AreaId = element.areaId;
      this.resultadoTest.ResultadoTestId = testId;
      // Asignar el tiempo empleado
      this.resultadoTest.tiempoEmpleado = this.tiempoEmpleado;

      //console.log(element.letras);
      //console.log(
      //  this.aparicionAleatoria(element) + `-` + this.respuestaPalabra(element)
      //);
      this.aparicionAleatoria(element) + `-` + this.respuestaPalabra(element);
      // Verificación y asignación de indicador y observación

      if (
        element.pMinimo !== undefined &&
        element.observacionSR &&
        element.observacionR
      ) {
        if (this.puntaje > element.pMinimo) {
          this.resultadoTest.indicador = 'SR';
          this.resultadoTest.observacion = element.observacionSR;
        } else {
          this.resultadoTest.indicador = 'R';
          this.resultadoTest.observacion = element.observacionR;
        }
      }
    }

    this.resultadoTest.ResultadoTestId = testId;
    this.resultadoTest.pObtenido = this.puntaje;

    // Calcular el valor a enviar al modal basado en el puntaje obtenido
    let modalValue: number;
    const pEsperado = this.palabras[0]?.pEsperado;

    if (this.puntaje === pEsperado) {
      modalValue = 60;
      this.soundService.AplausoSonido();
    } else if (this.puntaje > 1 && this.puntaje < pEsperado) {
      modalValue = 30;
      this.soundService.AnimoSonido();
    } else {
      modalValue = 10;
      this.soundService.EquivocadoSonido();
    }

    // Mostrar el modal después de 1 segundos
    setTimeout(() => {
      this.mostrarMensaje(modalValue);
    }, 1000);

    this.mostrarImagenes();

    await this.guardarResultado();
  };

  mostrarMensaje(value: number) {
    this.dialog.open(ModalAvisoComponent, {
      data: { value: value },
    });
  }

  aparicionAleatoria(element: Palabra): string {
    let retorno = '';
    for (let index = 0; index < element.letras.length; index++) {
      const letter = element.letras[index].letra;
      retorno += letter;
    }
    return retorno;
  }

  respuestaPalabra(element: Palabra): string {
    let retorno = '';
    for (let index = 0; index < element.letrasRespuesta.length; index++) {
      const letrasRespuesta = element.letrasRespuesta[index].letra;
      retorno += letrasRespuesta;
    }
    let resultado: ResultadoEjercicio = {
      respuestaRespondida: retorno,
      acierto: false,
      ejercicioId: element.ejercicioId,
      ejercicioOpcionesId: element.ejercicioOpcionesId,
      alumnoId: this.alumnoId, // Usar el alumnoId del servicio compartido
      resultadoItemId: 0,
    };

    if (retorno == element.respuesta) {
      this.respuestas;
      this.puntaje++;
      element.validez = this.rutaImagenCheck + 'correcto.png';
      resultado.acierto = true;
    } else {
      element.validez = this.rutaImagenCheck + 'incorrecto.png';
    }
    this.respuestas.push(resultado);
    return retorno;
  }

  cargarImagenes() {
    for (let i = 0; i < this.palabras.length; i++) {
      const element = this.palabras[i];
      const rutaImagen = 'assets/images/';
      //console.log('carga de imagenes: ', element.respuesta);
      this.imagenesEjercicio.push(rutaImagen + element.respuesta + '.png');
    }
    //console.log('array de rutas: ', this.imagenesEjercicio);
  }

  mostrarImagenes() {
    this.mostrarImagen = true;
  }

  async guardarResultado() {
    this.resultadosService.postResultadoItem(this.resultadoTest).subscribe({
      next: (response: ResultadoItemRespuesta) => {
        //console.log('Respuesta del insert de resultado: ', response);
        this.resultadoItemId = response.id;
        this.guardarResultadoEjercicio();
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  guardarResultadoEjercicio() {
    for (let index = 0; index < this.respuestas.length; index++) {
      const element = this.respuestas[index];
      element.resultadoItemId = this.resultadoItemId;
      this.resultadosService.postResultadoEjercicio(element).subscribe({
        next: (response) => {
          //console.log('datos insertados del ejercicio: ', response);
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
    }
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
