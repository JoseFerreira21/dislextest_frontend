import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { TestFormarPalabraComponent } from '../../layout/components/test/test-formar-palabra/test-formar-palabra.component';
import { TestSeleccionarPalabraComponent } from '../../layout/components/test/test-seleccionar-palabra/test-seleccionar-palabra.component';
import { TestTacharPalabraComponent } from '../../layout/components/test/test-tachar-palabra/test-tachar-palabra.component';
import { AdminComponentesService } from '@services/admin-componentes.service';
import { ResultadoTest, ResultadoTestPost } from '@models/resultados.model';
import { ResultadosService } from '@services/resultados.service';
import { SoundService } from '@services/sound.service';

import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '@services/global.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {

  @ViewChild('componentContainer', { read: ViewContainerRef, static: true }) componentContainer!: ViewContainerRef;
  components = [TestFormarPalabraComponent, TestSeleccionarPalabraComponent, TestTacharPalabraComponent];
  currentComponentIndex = 0;
  componentsInstance : any[] = [];
  resultadoTest: ResultadoTest;
  resultadoTestId: number = 0;

  constructor(private route: ActivatedRoute,
              private adminComponentesService: AdminComponentesService, 
              private resultadosService: ResultadosService,
              private soundService: SoundService,
              private globalService: GlobalService) {
    this.resultadoTest = {
      indicador: '',
      observacion: '',
      alumnoId: 0,
      profesorId: 0
    }
  }

  ngOnInit() {
    // Capturar el alumnoId desde los queryParams
     this.route.queryParams.subscribe(params => {
       const alumnoId = +params['alumnoId']; // El operador `+` convierte la cadena a número
       this.resultadoTest.alumnoId = alumnoId; // Asignar el id del alumno capturado
       //console.log('Alumno ID recibido:', alumnoId);
     }); 
    // Obtener el profesorId desde el servicio global
     this.globalService.getProfesorId().subscribe(profesorId => {
       if (profesorId !== null) {
         this.resultadoTest.profesorId = profesorId;
         //console.log('Profesor ID recibido:', profesorId);
         
         this.cargarEjercicios(this.currentComponentIndex);
         this.resultadoTest = {
           indicador: 'S',
           observacion: 'alguna',
           alumnoId: this.resultadoTest.alumnoId, 
           profesorId: this.resultadoTest.profesorId
         };
         this.insertarResultado();
       } else {
         console.error('No se pudo obtener el ID del profesor.');
       }
     });
   
   }


  siguienteEjercicio() {
    console.log(this.componentsInstance[this.currentComponentIndex]);
    this.soundService.ClickSiguienteSound();
    this.componentsInstance[this.currentComponentIndex].instance.guardar(this.resultadoTestId);

    setTimeout(() => {
      this.currentComponentIndex = (this.currentComponentIndex + 1) % this.components.length;
      this.cargarEjercicios(this.currentComponentIndex);
    }, 9000);
  }

  cargarEjercicios(index: number) {
    let componentsInstance :any = this.adminComponentesService.cargarEjercicios(this.componentContainer, this.components[index]);
    this.componentsInstance.push(componentsInstance);
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
        }
    });
  }
}
