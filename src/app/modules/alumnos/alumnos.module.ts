import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlumnosRoutingModule } from './alumnos-routing.module';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    //AlumnosComponent,
  ],
  imports: [
    CommonModule,
    AlumnosRoutingModule,
    AlumnosComponent,
    MatIconModule,
    MatDialogModule,
  ],
})
export class AlumnosModule {}
