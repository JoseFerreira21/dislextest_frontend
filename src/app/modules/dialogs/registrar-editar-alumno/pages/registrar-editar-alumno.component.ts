import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher, MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import {
  FormControl,
  FormGroup,
  Validators,
  FormGroupDirective,
  NgForm,
  FormBuilder,
} from '@angular/forms';
import { EntidadService } from '@services/entidad.service';
import { RequestStatus } from '@models/request-status.model';
import { AlumnosService } from '@services/alumnos.service';
import { Entidad } from 'src/app/interfaces/entidad';
import { AlumnosComponent } from '../../../alumnos/pages/alumnos/alumnos.component';
import { MatTableDataSource } from '@angular/material/table';
import { alumnoEntidad } from 'src/app/interfaces/alumnoEntidad';
import { TokenService } from '@services/token.service';
import { ProfesorService } from '@services/profesor.service';
import { Alumno } from 'src/app/interfaces/alumno';

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

@Component({
  selector: 'app-registrar-alumno',
  templateUrl: './registrar-editar-alumno.component.html',
  styleUrls: ['./registrar-editar-alumno.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class RegistrarAlumnoComponent implements OnInit {
  formAlumno: FormGroup;
  tituloAccion: string = 'Nuevo';
  botonAccion: string = 'Guardar';

  listaAlumnos: Entidad[] = [];
  dataSource = new MatTableDataSource<Entidad>();

  aluProfe = {
    entidadId: 0,
    profesorId: 0,
  };

  constructor(
    private _dialogoReferencia: MatDialogRef<RegistrarAlumnoComponent>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _entidadService: EntidadService,
    private _alumnosService: AlumnosService,
    private _tokenService: TokenService,
    private _profesorService: ProfesorService,
    @Inject(MAT_DIALOG_DATA) public dataAlumno: alumnoEntidad
  ) {
    this.formAlumno = this._formBuilder.group({
      tipoEntidad: ['AL'],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: [''],
      telefono: [''],
      direccion: [''],
      nroDocumento: ['', Validators.required],
      usuarioId: [],
    });

    let sub: number;
    sub = this._tokenService.getSub();
    // Si 'sub' existe, usamos para llamar a los servicios
    if (sub) {
      this._profesorService.getProfesorId(sub).subscribe({
        next: (dataResponse) => {
          // Verificar si el array de objetos no está vacío
          if (dataResponse.length > 0) {
            // Obtener el primer objeto del array y acceder a su propiedad 'id'
            const idProfesor = dataResponse[0].id;
            //console.log('ID del profesor:', idProfesor);
            this.aluProfe.profesorId = idProfesor;

            this._alumnosService.getAlumnosDelProfesor(idProfesor).subscribe({
              next: (dataResponse) => {
                //console.log(dataResponse);
                this.listaAlumnos = dataResponse;
              },
              error: (e) => {},
            });
          } else {
            console.error('El array de objetos está vacío.');
          }
        },
        error: (e) => {
          console.error('Error al obtener el ID del profesor:', e);
        },
      });
    } else {
      console.error("No se pudo obtener el campo 'sub' del token.");
    }
  }

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  agregarEditarAlumno() {
    const fechaNacimiento = moment(
      this.formAlumno.value.fechaNacimiento
    ).format('DD/MM/YYYY');
    const fechaISO: string = moment(
      fechaNacimiento,
      'DD/MM/YYYY'
    ).toISOString();
    const modelo: Entidad = {
      tipoEntidad: 'AL',
      nombre: this.formAlumno.value.nombre,
      apellido: this.formAlumno.value.apellido,
      fechaNacimiento: fechaISO,
      telefono: this.formAlumno.value.telefono,
      direccion: this.formAlumno.value.direccion,
      nroDocumento: this.formAlumno.value.nroDocumento,
      usuarioId: null,
    };

    if (this.dataAlumno === null) {
      this._entidadService.createEntidad(modelo).subscribe({
        next: (data) => {
          let respuesta: any;
          respuesta = JSON.parse(JSON.stringify(data));
          this.aluProfe.entidadId = respuesta.id;

          let sub: number;
          sub = this._tokenService.getSub();
          // Si 'sub' existe, usamos para llamar a los servicios
          if (sub) {
            this._profesorService.getProfesorId(sub).subscribe({
              next: (dataResponse) => {
                // Verificar si el array de objetos no está vacío
                if (dataResponse.length > 0) {
                  // Obtener el primer objeto del array y acceder a su propiedad 'id'
                  const idProfesor = dataResponse[0].id;
                  //console.log('ID del profesor:', idProfesor);
                  this.aluProfe.profesorId = idProfesor;

                  this._alumnosService.createAlumno(this.aluProfe).subscribe({
                    next: (data) => {},
                    error: (e) => {
                      //console.log(this.aluProfe);
                    },
                  });
                } else {
                  console.error('El array de objetos está vacío.');
                }
              },
              error: (e) => {
                console.error('Error al obtener el ID del profesor:', e);
              },
            });
          } else {
            console.error("No se pudo obtener el campo 'sub' del token.");
          }
          //---------------------------------------------------------//
          this.mostrarAlerta('Alumno fue registrado con éxito!', 'Listo');
          this._dialogoReferencia.close('creado');
        },
        error: (e) => {
          this.mostrarAlerta('No se pudo registrar el alumno', 'Error');
          console.log(modelo);
        },
      });
    } else {
      this._entidadService.updateEntidad(this.dataAlumno.id, modelo).subscribe({
        next: (data) => {
          console.log(data);
          this.mostrarAlerta('Alumno fue actualizado con éxito!', 'Listo');
          this._dialogoReferencia.close('editado');
        },
        error: (e) => {
          console.log(modelo);
          this.mostrarAlerta('No se pudo actualizar el alumno', 'Error');
        },
      });
    }
  }

  ngOnInit(): void {
    if (this.dataAlumno) {
      //console.log(this.dataAlumno);
      this.formAlumno.patchValue({
        nombre: this.dataAlumno.nombre,
        apellido: this.dataAlumno.apellido,
        fechaNacimiento: moment(this.dataAlumno.fechaNacimiento, 'DD/MM/YYYY'),
        telefono: this.dataAlumno.telefono,
        direccion: this.dataAlumno.direccion,
        nroDocumento: this.dataAlumno.nroDocumento,
      });

      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
  }
}
