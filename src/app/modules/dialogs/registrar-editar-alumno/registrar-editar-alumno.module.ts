import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';

import { RegistrarAlumnoComponent } from './pages/registrar-editar-alumno.component';
import { RegistrarAlumnosRoutingModule } from './registrar-editar-alumno-routing.module';

// Angular Material importaciones
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Para trabajar con controles de formularios de material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatStepperModule } from '@angular/material/stepper';

// Para trabajar con mensajes de alerta
import { MatSnackBarModule } from '@angular/material/snack-bar';

//Para trabajar con iconos de material
import { MatIconModule } from '@angular/material/icon';

// Para trabajar con los modales de material
import { MatDialogModule } from '@angular/material/dialog';

// Para trabajar con cuadriculas
import { MatGridListModule } from '@angular/material/grid-list';

// Angular Material CDK 
import { DragDropModule } from '@angular/cdk/drag-drop';
import {ObserversModule} from '@angular/cdk/observers';
import {CdkStepperModule} from '@angular/cdk/stepper';


@NgModule({
    declarations: [
        RegistrarAlumnoComponent,
    ],
    imports: [
        CommonModule,
        RegistrarAlumnosRoutingModule,
        CdkTableModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatRadioModule,
        MatCardModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MomentDateModule,
        MatStepperModule,
        MatSnackBarModule,
        MatIconModule,
        MatDialogModule,
        MatGridListModule,
        DragDropModule,
        ObserversModule,
        CdkStepperModule,
        MatIconModule,
    ]
})
export class RegistrarAlumnosModule { }
