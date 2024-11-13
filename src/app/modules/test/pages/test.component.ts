import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { TestFormarPalabraComponent } from '../../layout/components/test/test-formar-palabra/test-formar-palabra.component';
import { TestSeleccionarPalabraComponent } from '../../layout/components/test/test-seleccionar-palabra/test-seleccionar-palabra.component';
import { TestTacharPalabraComponent } from '../../layout/components/test/test-tachar-palabra/test-tachar-palabra.component';
import { AdminComponentesService } from '@services/admin-componentes.service';
import { ResultadoTest, ResultadoTestPost } from '@models/resultados.model';
import { ResultadosService } from '@services/resultados.service';
import { SoundService } from '@services/sound.service';
import { TextToSpeechService } from '@services/text-to-speech.service';

import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '@services/global.service';
import { SharedService } from '@services/shared.service';
import { TestEncontrarLetraComponent } from '../../layout/components/test/test-encontrar-letra/test-encontrar-letra.component';
import { TestEncerrarPalabraComponent } from '../../layout/components/test/test-encerrar-palabra/test-encerrar-palabra.component';
import { TestLetrasDesordenadasComponent } from '../../layout/components/test/test-letras-desordenadas/test-letras-desordenadas.component'; 
import { ModalDespedidaComponent } from '../../layout/components/dialogs/despedida-alumno/despedida-alumno.component';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TestEncerrarSilabaCsComponent } from '../../layout/components/test/test-encerrar-silaba-cs/test-encerrar-silaba-cs.component';
import { TestContarLetrasComponent } from '../../layout/components/test/test-contar-letras/test-contar-letras.component';
import { TestEncerrarSilabaCfComponent } from '../../layout/components/test/test-encerrar-silaba-cf/test-encerrar-silaba-cf.component';
import { TestIzquierdaDerechaComponent } from '../../layout/components/test/test-izquierda-derecha/test-izquierda-derecha.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  @ViewChild('componentContainer', { read: ViewContainerRef, static: true })
  componentContainer!: ViewContainerRef;
  components = [
    TestLetrasDesordenadasComponent,
    TestFormarPalabraComponent,
    TestSeleccionarPalabraComponent,
    TestTacharPalabraComponent,
    TestEncontrarLetraComponent,
    TestEncerrarPalabraComponent,
    TestEncerrarSilabaCsComponent,
    TestContarLetrasComponent,
    TestEncerrarSilabaCfComponent,
    TestIzquierdaDerechaComponent, 
  ];
  currentComponentIndex = 0;
  componentsInstance: any[] = [];
  resultadoTest: ResultadoTest;
  resultadoTestId: number = 0;

  startTime: number = 0;
  elapsedTime: number = 0;
  interval: any;
  isPosting: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private adminComponentesService: AdminComponentesService,
    private resultadosService: ResultadosService,
    private soundService: SoundService,
    private globalService: GlobalService,
    private sharedService: SharedService,
    private textToSpeechService: TextToSpeechService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.resultadoTest = {
      indicador: '',
      observacion: '',
      tiempoTotal: 0,
      alumnoId: 0,
      profesorId: 0,
    };
  }

  ngOnInit() {
    // Inicializar tiempo de inicio cuando se cargue el primer componente
    this.startTimer();
   
    // Capturar el alumnoId desde los queryParams
    this.route.queryParams.subscribe((params) => {
      const alumnoId = +params['alumnoId']; // El operador + convierte la cadena a número
      this.sharedService.setAlumnoId(alumnoId); // Almacenar en el servicio compartido
      this.resultadoTest.alumnoId = alumnoId; // Asignar el id del alumno capturado
      //console.log('Alumno ID recibido:', alumnoId);
    });
    // Obtener el profesorId desde el servicio global
    this.globalService.getProfesorId().subscribe((profesorId) => {
      if (profesorId !== null) {
        this.resultadoTest.profesorId = profesorId;
        //console.log('Profesor ID recibido:', profesorId);

        this.cargarEjercicios(this.currentComponentIndex);
        this.resultadoTest = {
          indicador: '',
          observacion: '',
          tiempoTotal: 0,
          alumnoId: this.resultadoTest.alumnoId,
          profesorId: this.resultadoTest.profesorId,
        };
        
        this.insertarResultado();
      } else {
        console.error('No se pudo obtener el ID del profesor.');
      }
    });
  }
  


  //CONTROL DE TIEMPO DE CARGA DE LOS COMPONENTES//
  startTimer() {
    this.startTime = Date.now();
    this.interval = setInterval(() => {
      this.elapsedTime += 1000; // Aumenta 1000 ms cada segundo
    }, 1000); // Actualiza cada segundo
  }
  pauseTimer() {
    clearInterval(this.interval);
    this.elapsedTime += Date.now() - this.startTime; // Añade el tiempo transcurrido desde el último `startTimer()`
  }
  
  resetTimer() {
    this.elapsedTime = 0; // Reinicia el tiempo total
  }

  getTotalElapsedTime() {
    return this.elapsedTime; // Devuelve el tiempo total transcurrido
  }
  //CONTROL DE TIEMPO DE CARGA DE LOS COMPONENTES//

  cargarEjercicios(index: number) {
    this.componentContainer.clear(); 
    let componentsInstance: any = this.adminComponentesService.cargarEjercicios(
      this.componentContainer,
      this.components[index]
    );
    this.componentsInstance.push(componentsInstance);
  }

  onButtonClick() {
    if (!this.isPosting && this.currentComponentIndex === this.components.length - 1) {
      this.finalizarTest();
    } else {
      this.siguienteEjercicio();
    }
  }

  siguienteEjercicio() {
    const currentComponentInstance = this.componentsInstance[this.currentComponentIndex]?.instance;

    if (currentComponentInstance?.seleccionCompleta && !this.isPosting) {
      this.isPosting = true; // Evita múltiples clics

      this.soundService.ClickSiguienteSound();
      currentComponentInstance.guardar(this.resultadoTestId);

      this.pauseTimer();

      setTimeout(() => {
        this.currentComponentIndex = (this.currentComponentIndex + 1) % this.components.length;
        this.cargarEjercicios(this.currentComponentIndex);

        this.isPosting = false; // Habilita el botón para el siguiente ejercicio
        this.startTimer();
      }, 4000);
    } else {
      this.textToSpeechService.speak(
        'Por favor, completa todos los ejercicios antes de continuar.'
      );
    }
  }
  

  insertarResultado() {
    //console.log('ResultadoTest antes del POST:', this.resultadoTest);
    this.resultadosService.postResultadoTest(this.resultadoTest).subscribe({
      next: (response: ResultadoTestPost) => {
        //console.log('Respuesta del insert de resultado: ', response);
        this.resultadoTestId = response.id;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  finalizarTest() {
    this.pauseTimer(); // Pausar el temporizador por última vez
    this.resultadoTest.tiempoTotal = this.getTotalElapsedTime(); // Asignar el tiempo total transcurrido
  
    const currentComponentInstance =
      this.componentsInstance[this.currentComponentIndex]?.instance;
  
    if (currentComponentInstance) {
      currentComponentInstance
        .guardar(this.resultadoTestId)
        .then(() => {
          // Actualizar el tiempo total en la base de datos
          this.actualizarTiempoTotal();
        })
        .catch((error: any) => {
          console.error(
            'Error al guardar los resultados del último test:',
            error
          );
          this.actualizarTiempoTotal(); // Intentar actualizar el tiempo total incluso si ocurre un error
        });
    } else {
      this.actualizarTiempoTotal();
    }
  }

  actualizarTiempoTotal() {
    if (this.resultadoTestId > 0) {
      this.resultadosService.putResultadoTest(this.resultadoTestId, this.resultadoTest).subscribe({
        next: (response) => {
          //console.log('Resultados actualizados con éxito:', response);
          this.mostrarDespedida(); // Mostrar el modal de despedida
        },
        error: (error) => {
          console.error('Error al actualizar los resultados:', error);
          this.mostrarDespedida(); // Aún mostrar la despedida en caso de error
        }
      });
    } else {
      console.error('No se ha definido el ID del resultado para actualizar');
    }
  }

  mostrarDespedida() {
    const dialogRef = this.dialog.open(ModalDespedidaComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/app/alumnos']); // Redirigir a la lista de alumnos
    });
  }
}
