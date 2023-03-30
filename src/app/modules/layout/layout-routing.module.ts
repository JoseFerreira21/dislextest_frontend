import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'perfil',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'alumnos',
        loadChildren: () =>
          import('../alumnos/alumnos.module').then((m) => m.AlumnosModule),
      },
      {
        path: 'resultados',
        loadChildren: () =>
          import('../resultados/resultados.module').then((m) => m.ResultadosModule),
      },
      {
        path: 'registrar-alumno',
        loadChildren: () =>
          import('../registrar-alumno/registrar-alumnos.module').then((m) => m.RegistrarAlumnosModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
