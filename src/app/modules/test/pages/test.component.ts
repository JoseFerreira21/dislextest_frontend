import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { TestFormarPalabraComponent } from '../../layout/components/test/test-formar-palabra/test-formar-palabra.component';
import { TestSeleccionarPalabraComponent } from '../../layout/components/test/test-seleccionar-palabra/test-seleccionar-palabra.component';
import { TestTacharPalabraComponent } from '../../layout/components/test/test-tachar-palabra/test-tachar-palabra.component';
import { AdminComponentesService } from '@services/admin-componentes.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {

  @ViewChild('componentContainer', { read: ViewContainerRef, static: true }) componentContainer!: ViewContainerRef;
  components = [TestFormarPalabraComponent, TestSeleccionarPalabraComponent, TestTacharPalabraComponent];
  currentComponentIndex = 0;

  constructor(private adminComponentesService: AdminComponentesService) {}

  ngOnInit() {
    this.cargarEjercicios(this.currentComponentIndex);
  }

  siguienteEjercicio() {
    this.currentComponentIndex = (this.currentComponentIndex + 1) % this.components.length;
    this.cargarEjercicios(this.currentComponentIndex);
  }

  cargarEjercicios(index: number) {
    this.adminComponentesService.cargarEjercicios(this.componentContainer, this.components[index]);
  }
}