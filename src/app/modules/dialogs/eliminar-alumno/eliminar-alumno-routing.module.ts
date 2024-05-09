import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EliminarAlumnoComponent } from './pages/eliminar-alumno.component'; 


const routes: Routes = [
  {
    path: '',
    component: EliminarAlumnoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EliminarAlumnosRoutingModule { }
