import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './pages/test.component';
import { TestRoutingModule } from './test-routing.module';
import { CdkTableModule } from '@angular/cdk/table';
import { TestPipe } from './pipes/test.pipe';


@NgModule({
    declarations: [
      TestComponent, TestPipe
    ],
    imports: [
      CommonModule,
      TestRoutingModule,
      CdkTableModule
    ]
  })
  export class TestModule { }
  