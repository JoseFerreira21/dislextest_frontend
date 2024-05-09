import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './pages/test.component';
import { TestRoutingModule } from './test-routing.module';
import { CdkTableModule } from '@angular/cdk/table';
import { LayoutModule } from '../layout/layout.module';
//import { TestPipe } from './pipes/test.pipe';


@NgModule({
    declarations: [
      TestComponent
    ],
    imports: [
      CommonModule,
      TestRoutingModule,
      CdkTableModule,
      LayoutModule
    ]
  })
  export class TestModule { }
  