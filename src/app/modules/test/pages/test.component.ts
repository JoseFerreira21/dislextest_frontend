import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { TestFormarPalabraComponent } from '../../layout/components/test/test-formar-palabra/test-formar-palabra.component';
import { TestSeleccionarPalabraComponent } from '../../layout/components/test/test-seleccionar-palabra/test-seleccionar-palabra.component';
import { TestTacharPalabraComponent } from '../../layout/components/test/test-tachar-palabra/test-tachar-palabra.component';
import { AdminComponentesService } from '@services/admin-componentes.service';
import { ResultadoTest, ResultadoTestPost } from '@models/resultados.model';
import { ResultadosService } from '@services/resultados.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {

  @ViewChild('componentContainer', { read: ViewContainerRef, static: true }) componentContainer!: ViewContainerRef;
  components = [TestFormarPalabraComponent, TestSeleccionarPalabraComponent, TestTacharPalabraComponent];
  currentComponentIndex = 0;
  componentsInstance : any[] = [];
  resultadoTest: ResultadoTest;

  constructor(private adminComponentesService: AdminComponentesService, private resultadosService: ResultadosService) {
    this.resultadoTest = {
      indicador: '',
      observacion: '',
      alumnoId: 0,
      profesorId: 0
    }
  }

  ngOnInit() {
    this.cargarEjercicios(this.currentComponentIndex);
    this.resultadoTest = {
      indicador: 'S',
      observacion: 'alguna',
      alumnoId: 1,
      profesorId: 1
    };
    this.insertarResultado();
  }

  siguienteEjercicio() {
    console.log(this.componentsInstance[this.currentComponentIndex]);
    this.componentsInstance[this.currentComponentIndex].instance.guardar();
    this.currentComponentIndex = (this.currentComponentIndex + 1) % this.components.length;
    this.cargarEjercicios(this.currentComponentIndex);

  }

  cargarEjercicios(index: number) {
    
    let componentsInstance :any = this.adminComponentesService.cargarEjercicios(this.componentContainer, this.components[index]);
    this.componentsInstance.push(componentsInstance);
  }

  insertarResultado(){
    this.resultadosService.postResultadoTest(this.resultadoTest).subscribe({
      next(response: ResultadoTestPost) {
        console.log('Respuesta del insert de resultado: ', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });

  }

}
