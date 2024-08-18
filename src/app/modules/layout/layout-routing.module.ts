import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from '@guards/auth.guard'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'alumnos',
        //canActivate: [AuthGuard],
        loadChildren: () =>
          import('../alumnos/alumnos.module').then((m) => m.AlumnosModule),
      },
      {
        path: 'resultados',
        //canActivate: [AuthGuard],
        loadChildren: () =>
          import('../resultados/resultados.module').then((m) => m.ResultadosModule),
      },
      
      {
        path: 'test',
        //canActivate: [AuthGuard],
        loadChildren: () =>
          import('../test/test.module').then((m) => m.TestModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
