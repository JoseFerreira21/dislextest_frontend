import { Component, OnInit, Inject } from '@angular/core';
import * as XLSX from 'xlsx';
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
import { Entidad } from 'src/app/models/entidad';
import { AlumnosComponent } from 'src/app/modules/alumnos/pages/alumnos/alumnos.component';
import { MatTableDataSource } from '@angular/material/table';
import { alumnoEntidad } from '@models/alumnoEntidad';
import { TokenService } from '@services/token.service';
import { ProfesorService } from '@services/profesor.service';
import { Alumno, CrearAlumnoDTO } from '@models/alumno';
import { GlobalService } from '@services/global.service';
import { switchMap } from 'rxjs/operators';

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
  styleUrls: ['./registrar-editar-alumno.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class RegistrarAlumnoComponent implements OnInit {
  formAlumno: FormGroup;
  tituloAccion: string = 'Nuevo';
  botonAccion: string = 'Guardar';

  listaAlumnos: Entidad[] = [];
  dataSource = new MatTableDataSource<Entidad>();
  alumnosMasivos: CrearAlumnoDTO[] = [];

  aluProfe = {
    id: 0,
    grado: '',
    año: 0,
    institucion: '',
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
    private globalService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public dataAlumno: alumnoEntidad
  ) {
    // Deshabilitar el cierre del modal al hacer clic fuera de él o con la tecla ESC
    this._dialogoReferencia.disableClose = true;

    this.formAlumno = this._formBuilder.group({
      tipoEntidad: ['AL'],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: [''],
      sexo: ['', Validators.required],
      telefono: [''],
      direccion: [''],
      nroDocumento: ['', Validators.required],
      grado: ['', Validators.required],
      año: ['', Validators.required],
      institucion: ['', Validators.required],
      usuarioId: [],
    });
  }
  
  ngOnInit(): void {
    if (this.dataAlumno) {
      // Primero llenamos los campos básicos de alumnoEntidad
      this.formAlumno.patchValue({
        nombre: this.dataAlumno.nombre,
        apellido: this.dataAlumno.apellido,
        fechaNacimiento: moment(this.dataAlumno.fechaNacimiento, 'DD/MM/YYYY'),
        sexo: this.dataAlumno.sexo,
        telefono: this.dataAlumno.telefono,
        direccion: this.dataAlumno.direccion,
        nroDocumento: this.dataAlumno.nroDocumento
      });
      //console.log(this.dataAlumno)
  
      // Llamamos al servicio para obtener el Alumno completo con grado, año, institución
      this._alumnosService.getAlumnoByEntidadID(this.dataAlumno.id).subscribe({
        next: (alumno: Alumno) => {
          // Ahora rellenamos los campos adicionales que solo están en la interfaz Alumno
          this.formAlumno.patchValue({
            grado: alumno.grado,
            año: alumno.año,
            institucion: alumno.institucion
          });
        },
        error: (e) => {
          console.error('Error al obtener los detalles del alumno:', e);
        }
      });
  
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
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
      sexo: this.formAlumno.value.sexo,
      telefono: this.formAlumno.value.telefono,
      direccion: this.formAlumno.value.direccion,
      nroDocumento: this.formAlumno.value.nroDocumento,
      usuarioId: null,
    };

    if (this.dataAlumno === null) {
      // Crear nuevo alumno
      this._entidadService.createEntidad(modelo).subscribe({
        next: (data) => {
          const respuesta = JSON.parse(JSON.stringify(data));
          this.aluProfe.entidadId = respuesta.id;
    
          this.globalService.getProfesorId().subscribe((profesorId) => {
            if (profesorId !== null) {
              this.aluProfe.profesorId = profesorId;
              this.aluProfe.grado = this.formAlumno.value.grado;
              this.aluProfe.año = parseInt(this.formAlumno.value.año, 10);
              this.aluProfe.institucion = this.formAlumno.value.institucion;
    
              const nuevoAlumno: CrearAlumnoDTO = {
                grado: this.aluProfe.grado,
                año: this.aluProfe.año,
                institucion: this.aluProfe.institucion,
                entidadId: this.aluProfe.entidadId,
                profesorId: this.aluProfe.profesorId,
              };
    
              //console.log('Datos que se enviarán al POST sin el id:', nuevoAlumno);
    
              // Crear el alumno para el profesor
              this._alumnosService.createAlumno(nuevoAlumno).subscribe({
                next: () => {
                  this.mostrarAlerta('Alumno fue registrado con éxito!', 'Listo');
                  this._dialogoReferencia.close('creado');
                },
                error: (e) => {
                  console.error('Error al crear el alumno:', e);
                  this.mostrarAlerta('No se pudo registrar el alumno', 'Error');
                },
              });
            } else {
              console.error('No se pudo obtener el ID del profesor.');
            }
          });
        },
        error: (e) => {
          this.mostrarAlerta('No se pudo registrar el alumno', 'Error');
        },
      });
    }
     else {
      // Editar alumno existente
      this.globalService.getProfesorId().subscribe(profesorId => {
        if (profesorId !== null) {
          // Obtener los datos completos del alumno usando el ID de la entidad
          this._alumnosService.getAlumnoByEntidadID(this.dataAlumno.id).pipe(
            switchMap((alumno: Alumno) => {
              //console.log('Alumno obtenido:', alumno); // Verifica que el alumno tiene el entidadId correcto
              return this._entidadService.updateEntidad(this.dataAlumno.id, modelo).pipe(
                switchMap(() => {
                  // Asignar correctamente el valor de entidadId
                  this.aluProfe.entidadId = alumno.entidadId; // Asegúrate de que entidadId sea correcto
                  this.aluProfe.profesorId = profesorId;
                  this.aluProfe.grado = this.formAlumno.value.grado;
                  this.aluProfe.año = parseInt(this.formAlumno.value.año, 10);
                  this.aluProfe.institucion = this.formAlumno.value.institucion;
                  this.aluProfe.id = alumno.id;
          
                  //console.log('Datos que se enviarán al PUT:', this.aluProfe);
          
                  // Actualizar alumno, pasando el ID en la URL y los demás datos en el cuerpo
                  return this._alumnosService.updateAlumno(this.aluProfe.id, {
                    grado: this.aluProfe.grado,
                    año: this.aluProfe.año,
                    institucion: this.aluProfe.institucion,
                    entidadId: this.aluProfe.entidadId,
                    profesorId: this.aluProfe.profesorId
                  });
                })
              );
            })
          ).subscribe({
            next: () => {
              this.mostrarAlerta('Alumno fue actualizado con éxito!', 'Listo');
              this._dialogoReferencia.close('editado');
            },
            error: (e) => {
              this.mostrarAlerta('No se pudo actualizar el alumno', 'Error');
              console.error('Error al actualizar el alumno:', e);
            }
          });

        } else {
          console.error('No se pudo obtener el ID del profesor.');
        }
      });
    }
  }


  crearAlumnosDesdePlanilla() {
    console.log("Descargando planilla...");
    // Aquí puedes agregar tu lógica de descarga
  }

  // Función para mostrar detalles adicionales
  mostrarDetallesPlanilla() {
    console.log("Mostrando detalles...");
    // Lógica para mostrar detalles
  }

}
