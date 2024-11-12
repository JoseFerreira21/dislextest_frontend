import { Component, OnInit, HostListener } from '@angular/core';
import { EncerrarPalabras, Palabra } from '@models/encerrar-palabra.model';
import { ResultadoEjercicio } from '@models/resultados-ejercicio.model';
import {
  ResultadoItem,
  ResultadoItemRespuesta,
} from '@models/resultados-item.model';
import { ResultadosService } from '@services/resultados.service';
import { TestService } from '@services/test.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAvisoComponent } from '../../dialogs/modal-aviso/modal-aviso.component';
import { TextToSpeechService } from '@services/text-to-speech.service';
import { SoundService } from '@services/sound.service';
import { SharedService } from '@services/shared.service';
import { Areas } from '@models/areas.model';

@Component({
  selector: 'app-test-encerrar-palabra',
  templateUrl: './test-encerrar-palabra.component.html',
  styleUrls: ['./test-encerrar-palabra.component.scss'],
})
export class TestEncerrarPalabraComponent implements OnInit {
  grupos: EncerrarPalabras[] = [];
  palabras: Palabra[] = [];
  areas: Areas[] = [];
  seleccion: { [key: number]: number } = {};
  puntos: number = 0;
  colores: string[] = [
    'color-0',
    'color-1',
    'color-2',
    'color-3',
    'color-4',
    'color-5',
  ];
  mostrarImagen: boolean = false;
  imagenesEjercicio: string[] = [];
  rutaImagenCheck: string = 'assets/images/';
  resultadoTest: ResultadoItem;
  resultadoItemId: number = 0;
  respuestas: ResultadoEjercicio[] = [];
  inactivityTimer: any;
  inactivityTimerActive: boolean = false; // Nueva bandera para controlar el temporizador
  alumnoId: number;
  seleccionCompleta: boolean = false;

  // Variables para el tiempo empleado
  startTime: number = 0;
  elapsedTime: number = 0;
  interval: any;
  tiempoEmpleado: number = 0;

  constructor(
    private testService: TestService,
    private resultadosService: ResultadosService,
    private textToSpeechService: TextToSpeechService,
    private soundService: SoundService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {
    this.resultadoTest = {
      AreaId: 0,
      indicador: '',
      observacion: '',
      tiempoEmpleado: 0,
      pObtenido: 0,
      ResultadoTestId: 0,
    };
    this.alumnoId = this.sharedService.getAlumnoId();
  }

  async ngOnInit() {
    try {
      this.puntos = 0;
      this.startTimer(); 
      this.inactivityTimerActive = false; // Desactivar inicialmente el temporizador de inactividad
      await Promise.all([this.cargarAreas(), this.cargarPalabras()]);
      this.unirPalabrasConAreas();
      this.cargarImagenes(); // <-- Llamada a cargar imágenes
      this.textToSpeechService.speak('Encierra la palabra correcta');
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }
  }

  // Iniciar el temporizador de tiempo empleado en el test/ejercicio
  startTimer() {
    this.startTime = Date.now();
    this.interval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.tiempoEmpleado = Math.floor(this.elapsedTime / 1000);  // Segundos transcurridos
    }, 1000);
  }

  // Calcular minutos y segundos para mostrar en el HTML
  getFormattedTime() {
    const minutes = Math.floor(this.tiempoEmpleado / 60);
    const seconds = this.tiempoEmpleado % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  escucharInstruccion() {
    this.textToSpeechService.speak('Encierra la palabra correcta');
  }

  async cargarPalabras(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.testService.getEncerrarPalabras().subscribe({
        next: (data) => {
          this.grupos = data;
          //console.log('Datos recibidos en cargarPalabras: ', this.grupos); // Depuración adicional
          resolve();
        },
        error: (error) => {
          console.error('Error en cargarPalabras:', error);
          reject(error);
        },
      });
    });
  }

  cargarImagenes() {
    this.imagenesEjercicio = [];
    for (let i = 0; i < this.grupos.length; i++) {
      const grupo = this.grupos[i];
      const rutaImagen = `assets/images/${grupo.respuesta}.png`; // Acceder a respuesta desde grupo
      this.imagenesEjercicio.push(rutaImagen);
    }
  }

  async cargarAreas() {
    return new Promise<void>((resolve, reject) => {
      this.testService.getAreas().subscribe({
        next: (data: Areas[]) => {
          this.areas = data;
          resolve();
        },
        error: (error) => reject(error),
      });
    });
  }

  unirPalabrasConAreas() {
    this.grupos.forEach((grupo) => {
      const area = this.areas.find((area) => area.id === grupo.areaId);
      if (area) {
        grupo.pEsperado = area.pEsperado;
        grupo.pMinimo = area.pMinimo;
        grupo.observacionR = area.observacionR;
        grupo.observacionSR = area.observacionSR;
      }
    });
  }

  seleccionar(grupoIndex: number, palabra: String, palabraIndex: number): void {
    const grupo = this.grupos[grupoIndex];
    grupo.palabras.forEach((palabra, index) => {
      palabra.estado = index === palabraIndex;
    });
    this.seleccion[grupoIndex] = palabraIndex;
    this.soundService.ClickSeleccionarSonido();

    // Verificar si la selección está completa
    this.verificarSeleccionCompleta();
  }

  verificarSeleccionCompleta() {
    this.seleccionCompleta = this.grupos.every(
      (grupo, index) => this.seleccion[index] !== undefined
    );

    if (this.seleccionCompleta) {
      this.inactivityTimerActive = true; // Asegúrate de activar la bandera
      this.startInactivityTimer(); // Inicia el temporizador de inactividad
    }
  }

  public guardar = async (testId: number) => {
    // Cancelar el temporizador de inactividad cuando se guarda el resultado
    this.cancelarInactivityTimer();
    for (let index = 0; index < this.grupos.length; index++) {
      const element = this.grupos[index];
      this.resultadoTest.AreaId = element.areaId;
      this.resultadoTest.ResultadoTestId = testId;

      let resultado: ResultadoEjercicio = {
        respuestaRespondida: '',
        acierto: false,
        ejercicioId: element.ejercicioId,
        ejercicioOpcionesId: element.ejercicioOpcionesId,
        alumnoId: this.alumnoId,
        resultadoItemId: 0
      };

      for (let j = 0; j < element.palabras.length; j++) {
        const palabra = element.palabras[j];

        if (palabra.estado) {
          resultado.respuestaRespondida = palabra.opcion;
        }

        if (palabra.estado && element.respuesta === palabra.opcion) {
          this.puntos++;
          resultado.acierto = true;
          palabra.validez = this.rutaImagenCheck + 'correcto.png';
        } else if (palabra.estado) {
          palabra.validez = this.rutaImagenCheck + 'incorrecto.png';
        }
      }
      // Asignar el tiempo empleado
      this.resultadoTest.tiempoEmpleado = this.tiempoEmpleado;
      this.respuestas.push(resultado);

      // Verificación y asignación de indicador y observación
      if (element.pMinimo !== undefined && element.observacionSR && element.observacionR) {
        this.resultadoTest.indicador = this.puntos > element.pMinimo ? 'SR' : 'R';
        this.resultadoTest.observacion = this.puntos > element.pMinimo ? element.observacionSR : element.observacionR;
      }
    }

    this.resultadoTest.pObtenido = this.puntos;

    // Calcular el valor a enviar al modal basado en el puntaje obtenido
    let modalValue: number;
    const pEsperado = this.grupos[0]?.pEsperado;
    
    if (this.puntos === 2) {
      modalValue = 60;
      this.soundService.AplausoSonido();
    } else if (this.puntos === 1) {
      modalValue = 30;
      this.soundService.AnimoSonido();
    } else {
      modalValue = 10;
      this.soundService.EquivocadoSonido();
    }

    // Mostrar el modal después de 0,5 segundos
    setTimeout(() => {
      this.mostrarMensaje(modalValue);
    }, 500);

    this.mostrarImagenes(); 
    await this.guardarResultado();
  }
  
    mostrarMensaje(value: number) {
      this.dialog.open(ModalAvisoComponent, {
        data: { value: value },
      });
    }
  



 async guardarResultado() {
    this.resultadosService.postResultadoItem(this.resultadoTest).subscribe({
      next: (response: ResultadoItemRespuesta) => {
        this.resultadoItemId = response.id;
        this.guardarResultadoEjercicio();
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
          //console.log('datos insertados del ejercicio 5: ', response);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    }
  }

  mostrarImagenes() {
    this.mostrarImagen = true;
  }

  getGrupoClasses(i: number) {
    return this.colores[i % this.colores.length];
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
