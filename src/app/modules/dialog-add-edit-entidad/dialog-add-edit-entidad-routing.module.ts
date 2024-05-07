import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogAddEditEntidadComponent } from './pages/dialog/dialog-add-edit-entidad.component'; 


const routes: Routes = [
  {
    path: '',
    component: DialogAddEditEntidadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DialogAddEditEntidadRoutingModule { }
