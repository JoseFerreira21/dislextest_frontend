import { Component, OnInit, HostListener } from '@angular/core';
import { TestService } from '@services/test.service';
import { Palabra, Letra, EncontrarLetras } from '@models/encontrar-letra.model';
import { ResultadoEjercicio } from '@models/resultados-ejercicio.model';
import {
  ResultadoItem,
  ResultadoItemRespuesta,
} from '@models/resultados-item.model';
import { ResultadosService } from '@services/resultados.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAvisoComponent } from '../../dialogs/modal-aviso/modal-aviso.component';
import { TextToSpeechService } from '@services/text-to-speech.service';
import { SoundService } from '@services/sound.service';
import { SharedService } from '@services/shared.service';
import { Areas } from '@models/areas.model';

@Component({
  selector: 'app-test-encontrar-letra',
  templateUrl: './test-encontrar-letra.component.html',
  styleUrls: ['./test-encontrar-letra.component.scss'],
})
export class TestEncontrarLetraComponent implements OnInit {
  encontrarLetras: EncontrarLetras[] = [];
  respuestas: ResultadoEjercicio[] = [];
  resultadoTest: ResultadoItem;
  resultadoItemId: number = 0;
  puntaje: number = 0;
  puntosUsadosPorGrupo: { [grupoId: number]: number } = {};
  areas: Areas[] = [];
  alumnoId: number;
  mostrarImagen: boolean = false;
  rutaImagenCheck: string = 'assets/images/';
  inactivityTimer: any;
  inactivityTimerActive: boolean = false; // Nueva bandera para controlar el temporizador
  // Atributo para verificar si se ha completado la selección
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
    this.alumnoId = this.sharedService.getAlumnoId();
  }

  async ngOnInit() {
    try {
      this.puntaje = 0;
      this.startTimer(); 
      
      await Promise.all([this.cargarAreas(), this.cargarPalabras()]);
      this.unirPalabrasConAreas();
      this.textToSpeechService.speak('Encierra la letra que se te indica');
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
    this.textToSpeechService.speak('Encierra la letra que se te indica');
  }

  async cargarPalabras(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.testService.getEncontrarLetraEnPalabra().subscribe({
        next: (data) => {
          this.encontrarLetras = data;
          //console.log('Datos de EncontrarLetras:', data);
          resolve();
          this.verificarSeleccionCompleta(); // Verificar después de cargar palabras
        },
        error: (error) => {
          console.error('Error al consultar al servicio:', error);
          reject(error);
        },
      });
    });
  }

  async cargarAreas(): Promise<void> {
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
    this.encontrarLetras.forEach((encontrarLetras) => {
      const area = this.areas.find(
        (area) => area.id === encontrarLetras.areaId
      );
      if (area) {
        encontrarLetras.pEsperado = area.pEsperado;
        encontrarLetras.pMinimo = area.pMinimo;
        encontrarLetras.observacionR = area.observacionR;
        encontrarLetras.observacionSR = area.observacionSR;
      }
    });
    //console.log('Palabras después de combinar con áreas:', this.encontrarLetras);
  }

  toggleSeleccion(letra: Letra, grupo: number) {
    if (letra.estado) return;

    const puntosPermitidos =
      this.encontrarLetras.find((e) =>
        e.palabras.some((p) => p.grupo === grupo)
      )?.puntos || 0;
    const puntosUsados = this.puntosUsadosPorGrupo[grupo] || 0;

    if (puntosUsados >= puntosPermitidos) {
      this.soundService.ClickDeseleccionarSonido();
      this.textToSpeechService.speak(
        'Ya has seleccionado el número máximo de letras permitidas.'
      );
      return;
    }

    this.soundService.ClickSeleccionarSonido();
    letra.estado = true;
    this.puntosUsadosPorGrupo[grupo] = puntosUsados + 1;

    // Verificar si se ha alcanzado el límite de selecciones
    this.verificarSeleccionCompleta();
  }

  verificarSeleccionCompleta() {
    let seleccionCorrecta = true;

    for (const grupo of this.encontrarLetras) {
      const totalSeleccionadas = grupo.palabras.reduce(
        (acc, palabra) =>
          acc + palabra.letras.filter((letra) => letra.estado).length,
        0
      );

      if (totalSeleccionadas !== grupo.puntos) {
        seleccionCorrecta = false;
        break;
      }
    }

    this.seleccionCompleta = seleccionCorrecta;
    //console.log('Seleccion Completa:', this.seleccionCompleta);

    if (this.seleccionCompleta) {
      this.inactivityTimerActive = true; // Activar el temporizador
      this.startInactivityTimer();
    }
  }

  respuestaLetra(element: EncontrarLetras) {
    let retorno = '';
    let aciertos = 0;

    element.palabras.forEach((palabra) => {
      let palabraCorrecta = true;

      palabra.letras.forEach((letra) => {
        if (letra.estado) {
          retorno += letra.letra;
          // Contar como acierto si la letra seleccionada es válida
          if (letra.valido) {
            aciertos++;
            letra.validez = this.rutaImagenCheck + 'correcto.png';
          } else {
            palabraCorrecta = false; // Marca la palabra como incorrecta si alguna letra no es válida
            letra.validez = this.rutaImagenCheck + 'incorrecto.png';
          }
        }
      });

      // Asignar la imagen de validez a cada palabra
      //palabra.validez = palabraCorrecta ? this.rutaImagenCheck + 'correcto.png' : this.rutaImagenCheck + 'incorrecto.png';
    });

    // Verificar si la concatenación de letras es válida
    const esAciertoCompleto = retorno
      .split('')
      .every((letra) => letra === element.respuesta);

    const resultado: ResultadoEjercicio = {
      respuestaRespondida: retorno,
      acierto: esAciertoCompleto || aciertos >= element.pMinimo, // Verifica si todas las letras son correctas o si los aciertos alcanzan el mínimo
      ejercicioId: element.ejercicioId,
      ejercicioOpcionesId: element.ejercicioOpcionesId,
      alumnoId: this.alumnoId,
      resultadoItemId: 0,
    };

    this.respuestas.push(resultado);
    this.puntaje += aciertos; // Suma los aciertos al puntaje total
  }

  public guardar = async (testId: number) => {
    // Cancelar el temporizador de inactividad cuando se guarda el resultado
    this.cancelarInactivityTimer();
    
    this.cancelarInactivityTimer();

    this.resultadoTest.ResultadoTestId = testId;

    this.encontrarLetras.forEach((element) => {
      this.respuestaLetra(element);
      this.resultadoTest.AreaId = element.areaId;
      // Asignar el tiempo empleado
      this.resultadoTest.tiempoEmpleado = this.tiempoEmpleado;
      // Verificación y asignación de indicador y observación
      if (
        element.pMinimo !== undefined &&
        element.observacionSR &&
        element.observacionR
      ) {
        this.resultadoTest.indicador =
          this.puntaje >= element.pMinimo ? 'SR' : 'R';
        this.resultadoTest.observacion =
          this.puntaje >= element.pMinimo
            ? element.observacionSR
            : element.observacionR;
      }
    });

    this.resultadoTest.pObtenido = this.puntaje;
    //console.log('Puntaje obtenido:', this.puntaje);

    // Calcular el valor a enviar al modal basado en el puntaje obtenido
    let modalValue: number;
    const pEsperado = this.encontrarLetras[0]?.pEsperado;

    if (this.puntaje === pEsperado) {
      modalValue = 60;
      this.soundService.AplausoSonido();
    } else if (this.puntaje > 2 && this.puntaje <= 6) {
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
  };

  mostrarImagenes() {
    this.mostrarImagen = true;
  }

  mostrarMensaje(value: number) {
    this.dialog.open(ModalAvisoComponent, {
      data: { value: value },
    });
  }

  async guardarResultado() {
    this.resultadosService.postResultadoItem(this.resultadoTest).subscribe({
      next: (response: ResultadoItemRespuesta) => {
        //console.log('Resultado guardado:', response);
        this.resultadoItemId = response.id;
        this.guardarResultadoEjercicio();
      },
      error: (error) => {
        console.error('Error al guardar el resultado:', error);
      },
    });
  }

  guardarResultadoEjercicio() {
    this.respuestas.forEach((element) => {
      element.resultadoItemId = this.resultadoItemId;
      this.resultadosService.postResultadoEjercicio(element).subscribe({
        next: (response) => {
          //console.log('Resultado del ejercicio guardado:', response);
        },
        error: (error) => {
          console.error('Error al guardar el detalle del ejercicio:', error);
        },
      });
    });
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
