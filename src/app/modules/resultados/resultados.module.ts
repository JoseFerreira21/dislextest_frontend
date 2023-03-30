import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { ResultadosRoutingModule } from './resultados-routing.module';
import { ResultadosComponent } from './pages/resultados-table/resultados.component';
//import { ResultadosTableComponent } from './pages/resultados-table/resultados-table.component'; 


@NgModule({
  declarations: [
    ResultadosComponent
    //ResultadosTableComponent
  ],
  imports: [
    CommonModule,
    ResultadosRoutingModule,
    CdkTableModule
  ]
})
export class ResultadosModule { }
