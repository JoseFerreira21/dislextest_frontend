import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher, MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { Entidad } from 'src/app/interfaces/entidad';
import {
  FormControl,
  FormGroup,
  Validators,
  FormGroupDirective,
  NgForm,
  FormBuilder,
} from '@angular/forms';
import { EntidadService } from '@services/entidad.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-dialog-add-edit-entidad',
  templateUrl: './dialog-add-edit-entidad.component.html',
  styleUrls: ['./dialog-add-edit-entidad.component.scss'],
  providers: [{ provide: MY_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})

export class DialogAddEditEntidadComponent implements OnInit {
  
  formEntidad: FormGroup;
  tituloAccion: string = 'Nuevo';
  botonAccion: string = 'Guardar';

  listaEntidades: Entidad[] = [];

  constructor(
    private _dialogoReferencia: MatDialogRef<DialogAddEditEntidadComponent>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _entidadService: EntidadService
  ) {
    this.formEntidad = this._formBuilder.group({
      tipoEntidad: ['AL'],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: [''],
      telefono: [''],
      direccion: [''],
      nroDocumento: ['', Validators.required],
      usuarioId: [],
    });

    this._entidadService.getEntidadList().subscribe({
      next: (dataResponse) => {
        console.log(dataResponse);
        this.listaEntidades = dataResponse;
      },
      error: (e) => {},
    });
  }

  mostrarAlerta(msg: string, accion: string){
    this._snackBar.open(msg, accion, {
      horizontalPosition: "end",
      verticalPosition:"top",
      duration: 3000
    })
  }

  addEditEntidad(){
    console.log(this.formEntidad)
    console.log(this.formEntidad.value)
  }


  ngOnInit(): void {}
}


