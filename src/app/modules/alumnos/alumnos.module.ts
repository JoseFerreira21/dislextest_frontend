import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumnosRoutingModule } from './alumnos-routing.module';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';  // Asegúrate de agregar este
import { MatSnackBarModule } from '@angular/material/snack-bar';  // Para las notificaciones

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AlumnosRoutingModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule, // Agrega esto para los botones
    MatSnackBarModule, // Agrega esto para los snackbars
  ],
})
export class AlumnosModule {}