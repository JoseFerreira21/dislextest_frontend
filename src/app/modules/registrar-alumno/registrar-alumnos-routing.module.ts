import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarAlumnoComponent } from './pages/registrar-alumno.component';


const routes: Routes = [
  {
    path: '',
    component: RegistrarAlumnoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrarAlumnosRoutingModule { }
