import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '@shared/shared.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TestFormarPalabraComponent } from './components/test/test-formar-palabra/test-formar-palabra.component';
import { TestSeleccionarPalabraComponent } from './components/test/test-seleccionar-palabra/test-seleccionar-palabra.component';
import { TestTacharPalabraComponent } from './components/test/test-tachar-palabra/test-tachar-palabra.component';
import { TestPipe } from '../../pipes/test.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    LayoutComponent,
    NavbarComponent,
    TestFormarPalabraComponent,
    TestSeleccionarPalabraComponent,
    TestTacharPalabraComponent,
    TestPipe
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    OverlayModule,
    FontAwesomeModule,
    SharedModule,
    DragDropModule
  ],
  exports: [
    TestFormarPalabraComponent,
    TestSeleccionarPalabraComponent,
    TestTacharPalabraComponent
  ]
})
export class LayoutModule { }
