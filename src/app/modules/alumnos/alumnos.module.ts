import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { AlumnosRoutingModule } from './alumnos-routing.module';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';
import { DialogAddEditEntidadComponent } from '../dialog-add-edit-entidad/pages/dialog/dialog-add-edit-entidad.component';


@NgModule({
  declarations: [
    //AlumnosComponent,
  ],
  imports: [
    CommonModule,
    AlumnosRoutingModule,
    AlumnosComponent
  ]
})
export class AlumnosModule { }
