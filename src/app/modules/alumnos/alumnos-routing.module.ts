import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlumnosTableComponent } from './pages/users-table/alumnos-table.component';

const routes: Routes = [
  {
    path: '',
    component: AlumnosTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnosRoutingModule { }
