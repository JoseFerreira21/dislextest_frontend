// import { Component, OnInit } from '@angular/core';
// import { TacharPalabraEstructura } from '@models/tachar-palabra.model';
// import { TestService } from '@services/test.service';

// @Component({
//   selector: 'app-test-tachar-palabra',
//   templateUrl: './test-tachar-palabra.component.html',
//   styleUrls: ['./test-tachar-palabra.component.scss']
// })
// export class TestTacharPalabraComponent {

//   respuesta: String = '';
//   puntos: number = 0;

//   opcionesGrupo: TacharPalabraEstructura[] = [];

//   constructor(private testService: TestService) { }

//   ngOnInit() {
//     this.puntos = 0 ;
//     this.cargarPalabras();
//   }

//   public guardar = () => {
//     console.log(this.opcionesGrupo);
//     for (let index = 0; index < this.opcionesGrupo.length; index++) {
//       const element = this.opcionesGrupo[index];
//       console.log('La respuesta correcta: ', element.respuesta);
//       for (let j = 0; j < this.opcionesGrupo[index].palabras.length; j++) {
//         const element = this.opcionesGrupo[index].palabras[j];
//         if (element.estado && this.opcionesGrupo[index].respuesta == element.opcion) {
//           console.log('seleccionado correcto', element);
//           this.puntos++
//         }
//       }
//     }
//     console.log('Puntaje total del ejercicio 2: ', this.puntos);
//   }

//   cargarPalabras() {
//     this.testService.getTacharPalabra().subscribe({
//       next: (data) => {
//         this.opcionesGrupo = data;
//         console.log('Resultado del service: ', this.opcionesGrupo);
//       },
//       error: (error) => console.error('Error al consultar al service para el ejercicio Tachar Palabra:', error)
//     });
//   }

//   seleccionarRespuesta(grupoIndex: number, palabra: String, palabraIndex: number): void {
//     const grupo = this.opcionesGrupo[grupoIndex];
//     this.opcionesGrupo[grupoIndex].palabras.forEach(opt => opt.estado = false);
//     console.log('Grupo: ', grupo);

//     const palabraSeleccionada = grupo.palabras[palabraIndex];
//     palabraSeleccionada.estado = true;

//     console.log(`Respuesta para el grupo ${grupoIndex + 1}: ${palabraSeleccionada.opcion}`);

//   }
// }

import { Component, OnInit, HostListener } from '@angular/core';
import { TacharPalabraEstructura } from '@models/tachar-palabra.model';
import { TestService } from '@services/test.service';
import { TextToSpeechService } from '@services/text-to-speech.service'; // Importar el servicio
import { SoundService } from '@services/sound.service'; // Importar el servicio

@Component({
  selector: 'app-test-tachar-palabra',
  templateUrl: './test-tachar-palabra.component.html',
  styleUrls: ['./test-tachar-palabra.component.scss']
})
export class TestTacharPalabraComponent implements OnInit {
  respuesta: String = '';
  puntos: number = 0;
  opcionesGrupo: TacharPalabraEstructura[] = [];
  colores: string[] = ['color-0', 'color-1'];
  inactivityTimer: any;

  constructor(
    private testService: TestService,
    private textToSpeechService: TextToSpeechService, // Inyectar el servicio
    private soundService: SoundService // Inyectar el servicio
  ) { }

  async ngOnInit() {
    this.puntos = 0;
    try {
      await this.cargarPalabras();
      this.textToSpeechService.speak('Tacha la palabra entre un conjunto de ellas'); // llamar al metodo speak con el texto necesario para la pantalla
    } catch (error) {
      console.error('Error en ngOnInit: ', error);
    }
  }

  // Registrar eventos de actividad del usuario
  @HostListener('window:click')
  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => {
      this.textToSpeechService.speak('Favor, oprima el botón siguiente si ya terminó los ejercicios');
    }, 10000); // 10 segundos
  }

  public guardar = () => {
    this.opcionesGrupo.forEach((grupo) => {
      grupo.palabras.forEach((palabra) => {
        if (palabra.estado && grupo.respuesta === palabra.opcion) {
          this.puntos++;
        }
      });
    });
    console.log('Puntaje total del ejercicio 3: ', this.puntos);
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

  seleccionarRespuesta(grupoIndex: number, palabra: String, palabraIndex: number): void {
    const grupo = this.opcionesGrupo[grupoIndex];
    grupo.palabras.forEach((opt) => (opt.estado = false));
    const palabraSeleccionada = grupo.palabras[palabraIndex];
    palabraSeleccionada.estado = true;
    console.log(`Respuesta para el grupo ${grupoIndex + 1}: ${palabraSeleccionada.opcion}`);
    this.soundService.ClickSeleccionarSonido();
    this.resetInactivityTimer(); // Resetear el temporizador al seleccionar una palabra
  }

  getGrupoClasses(i: number) {
    const colorClass = this.colores[i % this.colores.length];
    return colorClass;
  }
}

