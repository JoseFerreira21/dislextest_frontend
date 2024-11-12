import { Component, OnInit, HostListener } from '@angular/core';
import { TacharPalabraEstructura, Palabra } from '@models/tachar-palabra.model';
import { TestService } from '@services/test.service';
import { ResultadosService } from '@services/resultados.service';
import { TextToSpeechService } from '@services/text-to-speech.service';
import { SoundService } from '@services/sound.service';
import { ModalAvisoComponent } from '../../dialogs/modal-aviso/modal-aviso.component';
import {
  ResultadoItem,
  ResultadoItemRespuesta,
} from '@models/resultados-item.model';
import { ResultadoEjercicio } from '@models/resultados-ejercicio.model';
import { SharedService } from '@services/shared.service'; // Importar el servicio compartido
import { Areas } from '@models/areas.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-test-tachar-palabra',
  templateUrl: './test-tachar-palabra.component.html',
  styleUrls: ['./test-tachar-palabra.component.scss'],
})
export class TestTacharPalabraComponent implements OnInit {
  respuesta: string = '';
  puntos: number = 0;
  palabra: Palabra[] = [];
  opcionesGrupo: TacharPalabraEstructura[] = [];
  areas: Areas[] = []; // Array para almacenar las áreas cargadas
  colores: string[] = ['color-0', 'color-1'];
  mostrarImagen: boolean = false;
  rutaImagenCheck: string = 'assets/images/';
  inactivityTimer: any;
  inactivityTimerActive: boolean = false; // Nueva bandera para controlar el temporizador
  resultadoTest: ResultadoItem;
  resultadoItemId: number = 0;
  respuestas: ResultadoEjercicio[] = [];
  alumnoId: number; // Variable para almacenar el alumnoId
  seleccionCompleta: boolean = false; // Atributo para controlar si se ha completado la selección
  
  // Variables para el tiempo empleado
  startTime: number = 0;
  elapsedTime: number = 0;
  interval: any;
  tiempoEmpleado: number = 0;

  constructor(
    private testService: TestService,
    private textToSpeechService: TextToSpeechService,
    private soundService: SoundService,
    private resultadosService: ResultadosService,
    private sharedService: SharedService, // Inyectar el servicio compartido
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
    this.alumnoId = this.sharedService.getAlumnoId(); // Obtener el alumnoId del servicio compartido
  }

  async ngOnInit() {
    try {
      this.puntos = 0;
      this.startTimer(); 

      this.inactivityTimerActive = false; // Desactivar inicialmente el temporizador de inactividad
      // Cargar áreas y palabras en paralelo
      await Promise.all([this.cargarAreas(), this.cargarPalabras()]);

      // Combinar palabras y áreas una vez que ambas se hayan cargado
      this.unirPalabrasConAreas();

      this.textToSpeechService.speak(
        'Tacha la palabra correcta'
      );
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
    this.textToSpeechService.speak(
      'Tacha la palabra correcta'
    );
  }

  async cargarPalabras(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.testService.getTacharPalabra().subscribe({
        next: (data) => {
          this.opcionesGrupo = data;
          //console.log('Datos de TacharPalabra:', data);
          resolve(); // Resuelve la promesa cuando los datos se hayan cargado correctamente
        },
        error: (error) => {
          console.error('Error al consultar al service:', error);
          reject(error); // Rechaza la promesa si ocurre un error
        },
      });
    });
  }

  async cargarAreas() {
    return new Promise<void>((resolve, reject) => {
      this.testService.getAreas().subscribe({
        next: (data: Areas[]) => {
          //console.log('Datos de áreas recibidos:', data);
          this.areas = data;
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
    this.opcionesGrupo.forEach((grupo) => {
      const area = this.areas.find((area) => area.id === grupo.areaId);
      if (area) {
        grupo.pEsperado = area.pEsperado;
        grupo.pMinimo = area.pMinimo;
        grupo.observacionR = area.observacionR;
        grupo.observacionSR = area.observacionSR;
      } else {
        console.warn(
          `No se encontró el área para el grupo con areaId: ${grupo.areaId}`
        );
      }
    });

    //console.log('Grupos después de combinar con áreas:', this.opcionesGrupo);
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

  public guardar = async (testId: number) => {
    // Cancelar el temporizador de inactividad cuando se guarda el resultado
    this.cancelarInactivityTimer();

    this.respuestas = []; // Reiniciamos el array de respuestas
    for (let index = 0; index < this.opcionesGrupo.length; index++) {
      const grupo = this.opcionesGrupo[index];
      this.resultadoTest.AreaId = grupo.areaId;
      this.resultadoTest.ResultadoTestId = testId;

      // Filtrar la palabra seleccionada
      const palabraSeleccionada = grupo.palabras.find(
        (palabra) => palabra.estado
      );

      // Asignar el tiempo empleado
      this.resultadoTest.tiempoEmpleado = this.tiempoEmpleado;

      if (palabraSeleccionada) {
        let resultado: ResultadoEjercicio = {
          respuestaRespondida: palabraSeleccionada.opcion,
          acierto: grupo.respuesta === palabraSeleccionada.opcion,
          ejercicioId: grupo.ejercicioId,
          ejercicioOpcionesId: palabraSeleccionada.ejercicioOpcionesId,
          alumnoId: this.alumnoId, // Usar el alumnoId del servicio compartido
          resultadoItemId: 0,
        };

        // Si la palabra seleccionada es correcta, incrementa el puntaje
        if (resultado.acierto) {
          this.puntos++;
          palabraSeleccionada.validez = this.rutaImagenCheck + 'correcto.png'; // Asigna la imagen correcta
        } else {
          palabraSeleccionada.validez = this.rutaImagenCheck + 'incorrecto.png'; // Asigna la imagen incorrecta
        }

        // Agrega la respuesta a la lista de respuestas
        this.respuestas.push(resultado);
      }

      // Verificación y asignación de indicador y observación
      if (
        grupo.pMinimo !== undefined &&
        grupo.observacionSR &&
        grupo.observacionR
      ) {
        if (this.puntos > grupo.pMinimo) {
          this.resultadoTest.indicador = 'SR';
          this.resultadoTest.observacion = grupo.observacionSR;
        } else {
          this.resultadoTest.indicador = 'R';
          this.resultadoTest.observacion = grupo.observacionR;
        }
      }
    }

    // Guardar el resultado del test con el puntaje obtenido
    this.resultadoTest.pObtenido = this.puntos;

    // Calcular el valor a enviar al modal basado en el puntaje obtenido
    let modalValue: number;
    const pEsperado = this.opcionesGrupo[0]?.pEsperado;
    
    if (this.puntos === pEsperado) {
      modalValue = 60;
      this.soundService.AplausoSonido();
    } else if (this.puntos === 1) {  
      modalValue = 30;
      this.soundService.AnimoSonido();
    } else if (this.puntos === 0) { 
      modalValue = 10;
      this.soundService.EquivocadoSonido();
    }

    // Mostrar el modal después de 0,5 segundos
    setTimeout(() => {
      this.mostrarMensaje(modalValue);
    }, 500);

    // Mostrar las imágenes de validación después de calcular los resultados
    this.mostrarImagenes();

    await this.guardarResultado();
  };

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
        console.error('Error al guardar el resultado:', error);
      },
    });
  }

  guardarResultadoEjercicio() {
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

  seleccionarRespuesta(
    grupoIndex: number,
    palabra: string,
    palabraIndex: number
  ): void {
    const grupo = this.opcionesGrupo[grupoIndex];
    grupo.palabras.forEach((opt) => (opt.estado = false));
    const palabraSeleccionada = grupo.palabras[palabraIndex];
    palabraSeleccionada.estado = true;
    /*console.log(
      `Respuesta seleccionada para el grupo ${grupoIndex + 1}: ${
        palabraSeleccionada.opcion
      }`
    );*/
    this.soundService.ClickSeleccionarSonido();
    //this.resetInactivityTimer();

    // Verificar si se ha completado la selección
    this.verificarSeleccionCompleta();
  }

  verificarSeleccionCompleta() {
    this.seleccionCompleta = this.opcionesGrupo.every((grupo) =>
      grupo.palabras.some((palabra) => palabra.estado)
    );

    if (this.seleccionCompleta) {
      this.inactivityTimerActive = true; // Activar el temporizador
      this.startInactivityTimer();
    }
    //console.log('Selección completa:', this.seleccionCompleta);
  }

  cargarImagenes() {
    for (let i = 0; i < this.opcionesGrupo.length; i++) {
      const element = this.opcionesGrupo[i];
      const rutaImagen = 'assets/images/';
      //console.log('carga de imagenes: ', element.respuesta);
    }
  }

  mostrarImagenes() {
    this.mostrarImagen = true;
  }

  getGrupoClasses(i: number) {
    const colorClass = this.colores[i % this.colores.length];
    return colorClass;
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
