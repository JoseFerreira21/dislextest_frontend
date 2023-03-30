import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { RegistrarAlumnoComponent } from './pages/registrar-alumno.component';
import { RegistrarAlumnosRoutingModule } from './registrar-alumnos-routing.module';

// Angular Material importaciones
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material CDK 
import { DragDropModule } from '@angular/cdk/drag-drop';
import {ObserversModule} from '@angular/cdk/observers';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { SharedModule } from "../shared/shared.module";



@NgModule({
    declarations: [
        RegistrarAlumnoComponent,
    ],
    imports: [
        CommonModule,
        RegistrarAlumnosRoutingModule,
        CdkTableModule,
        //----//
        MatNativeDateModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        DragDropModule,
        MatCardModule,
        MatCheckboxModule,
        ObserversModule,
        CdkStepperModule,
        //----//  
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class RegistrarAlumnosModule { }
