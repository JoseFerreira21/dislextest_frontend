import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { AlumnosRoutingModule } from './alumnos-routing.module';
import { AlumnosTableComponent } from './pages/alumnos-table/alumnos-table.component';


@NgModule({
  declarations: [
    AlumnosTableComponent,
  ],
  imports: [
    CommonModule,
    AlumnosRoutingModule,
    CdkTableModule
  ]
})
export class AlumnosModule { }
