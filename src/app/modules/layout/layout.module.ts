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
import { TestEncontrarLetraComponent } from './components/test/test-encontrar-letra/test-encontrar-letra.component';
import { TestLetrasDesordenadasComponent } from './components/test/test-letras-desordenadas/test-letras-desordenadas.component';
import { TestEncerrarSilabaCsComponent } from './components/test/test-encerrar-silaba-cs/test-encerrar-silaba-cs.component';
import { TestPipe } from '../../pipes/test.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReportComponent } from './components/report/report.component';
import { TestEncerrarPalabraComponent } from './components/test/test-encerrar-palabra/test-encerrar-palabra.component';
import { MatIconModule } from '@angular/material/icon';
import { TestContarLetrasComponent } from './components/test/test-contar-letras/test-contar-letras.component';
import { TestEncerrarSilabaCfComponent } from './components/test/test-encerrar-silaba-cf/test-encerrar-silaba-cf.component';
import { TestIzquierdaDerechaComponent } from './components/test/test-izquierda-derecha/test-izquierda-derecha.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    LayoutComponent,
    NavbarComponent,
    TestFormarPalabraComponent,
    TestSeleccionarPalabraComponent,
    TestTacharPalabraComponent,
    TestEncontrarLetraComponent,
    TestEncerrarPalabraComponent,
    TestLetrasDesordenadasComponent,
    TestEncerrarSilabaCsComponent,
    TestContarLetrasComponent,
    TestEncerrarSilabaCfComponent,
    TestIzquierdaDerechaComponent,
    TestPipe,
    ReportComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    OverlayModule,
    FontAwesomeModule,
    SharedModule,
    DragDropModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [
    TestFormarPalabraComponent,
    TestSeleccionarPalabraComponent,
    TestTacharPalabraComponent,
    TestEncontrarLetraComponent,
    TestEncerrarPalabraComponent,
    TestLetrasDesordenadasComponent,
    TestEncerrarSilabaCsComponent,
    TestContarLetrasComponent,
    TestEncerrarSilabaCfComponent,
    TestIzquierdaDerechaComponent,
  ]
})
export class LayoutModule { }
