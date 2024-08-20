import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



import { TokenInterceptor } from 'src/interceptors/token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
import { ModalAvisoComponent } from './modules/layout/components/dialogs/modal-aviso/modal-aviso.component';
import { BienvenidaAlumnoComponent } from './modules/layout/components/dialogs/bienvenida-alumno/bienvenida-alumno.component'; 
import { EliminarAlumnoComponent } from './modules/layout/components/dialogs/eliminar-alumno/eliminar-alumno.component';
import { RegistrarAlumnoComponent } from './modules/layout/components/dialogs/registrar-editar-alumno/registrar-editar-alumno.component'; 
import { DetallesEjercicioComponent } from './modules/layout/components/dialogs/detalles-ejercicio/detalles-ejercicio.component';

@NgModule({
  declarations: [AppComponent, RegistrarAlumnoComponent, EliminarAlumnoComponent, ModalAvisoComponent, BienvenidaAlumnoComponent, DetallesEjercicioComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
    MatDialogModule,
    MatGridListModule,
    DragDropModule,
    ObserversModule,
    CdkStepperModule,
    MatIconModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
