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
  
  
  constructor(
    private _dialogoReferencia: MatDialogRef<RegistrarAlumnoComponent>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _entidadService: EntidadService,
    private _alumnosService : AlumnosService,
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

    this._alumnosService.getAlumnosDelProfesor(1).subscribe({
    next: (dataResponse) => {
        console.log(dataResponse);
        this.listaAlumnos = dataResponse;
      },
      error: (e) => {},
    });
  }

  mostrarAlerta(msg: string, accion: string){
    this._snackBar.open(msg, accion, {
      horizontalPosition: "end",
      verticalPosition:"top",
      duration: 3000
    });
  }

  agregarEditarAlumno(){
    const fechaNacimiento = moment(this.formAlumno.value.fechaNacimiento, "DD/MM/YYYY").toDate();
    if (!moment(fechaNacimiento).isValid()) {
        console.error("La fecha de nacimiento no es válida.");
        return;
    }
    console.log(this.formAlumno.value);
    console.log(fechaNacimiento);
    const modelo : Entidad = {
      id :0,
      tipoEntidad: 'AL',
      nombre: this.formAlumno.value.nombre,
      apellido: this.formAlumno.value.apellido,
      fechaNacimiento: fechaNacimiento,
      telefono: this.formAlumno.value.telefono,
      direccion: this.formAlumno.value.direccion,
      nroDocumento: this.formAlumno.value.nroDocumento
    }
    
    if (this.dataAlumno === null){
      this._entidadService.createEntidad(modelo).subscribe({
        next: (data) => {
          console.log(data);
          this.mostrarAlerta("Alumno fue registrado con éxito!", "Listo")
          this._dialogoReferencia.close("creado")
        },
        error: (e) => {
          this.mostrarAlerta("No se pudo registrar el alumno", "Error")
        },
      });
    } else {
      this._entidadService.updateEntidad(this.dataAlumno.id, modelo).subscribe({
        next: (data) => {
          console.log(data);
          this.mostrarAlerta("Alumno fue actualizado con éxito!", "Listo")
          this._dialogoReferencia.close("editado")
        },
        error: (e) => {
          this.mostrarAlerta("No se pudo actualizar el alumno", "Error")
        },
      });
    }
 
  }
  
  ngOnInit(): void {
    if (this.dataAlumno){
      console.log(this.dataAlumno);
      this.formAlumno.patchValue({
        nombre: this.dataAlumno.nombre,
        apellido: this.dataAlumno.apellido,
        fechaNacimiento: moment(this.dataAlumno.fechaNacimiento , "DD/MM/YYYY"),
        telefono: this.dataAlumno.telefono,
        direccion: this.dataAlumno.direccion,
        nroDocumento: this.dataAlumno.nroDocumento
      })

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }
}