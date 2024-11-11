import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumnosRoutingModule } from './alumnos-routing.module';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';  
import { MatSnackBarModule } from '@angular/material/snack-bar'; 

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
    MatButtonModule, 
    MatSnackBarModule, 
  ],
})
export class AlumnosModule {}