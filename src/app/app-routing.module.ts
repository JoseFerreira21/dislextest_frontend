import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard'
import { RedirectGuard } from '@guards/redirect.guard'
import { ResultadosComponent } from './modules/resultados/pages/resultados-table/resultados.component'; 
import { ReportComponent } from './modules/layout/components/report/report.component'; 

const routes: Routes = [
  {
    path: '',
    canActivate: [RedirectGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
  { path: 'test', loadChildren: () => import('./modules/test/test.module').then(m => m.TestModule) },
  { path: '', component: ResultadosComponent },
  { path: 'report', component: ReportComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
