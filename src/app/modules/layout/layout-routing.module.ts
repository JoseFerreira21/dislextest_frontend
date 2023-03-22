import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'boards',
        pathMatch: 'full'
      },
      
      /*{
        path: 'boards',
        loadChildren: () =>
          import('../boards/boards.module').then((m) => m.BoardsModule),
      },*/
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
