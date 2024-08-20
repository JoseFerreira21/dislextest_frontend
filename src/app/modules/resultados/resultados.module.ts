import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { ResultadosRoutingModule } from './resultados-routing.module';
import { ResultadosComponent } from './pages/resultados-table/resultados.component';
import { FormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    ResultadosComponent
  ],
  imports: [
    CommonModule,
    ResultadosRoutingModule,
    CdkTableModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
  ]
})
export class ResultadosModule { }
