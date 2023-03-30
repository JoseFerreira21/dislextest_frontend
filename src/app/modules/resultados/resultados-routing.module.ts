import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

///import { ResultadosTableComponent } from './pages/resultados-table/resultados-table.component';
import { ResultadosComponent } from './pages/resultados-table/resultados.component';

const routes: Routes = [
  {
    path: '',
    component: ResultadosComponent //ResultadosTableComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultadosRoutingModule { }
