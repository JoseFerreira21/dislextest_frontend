import { Component, OnInit, Inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorStateMatcher, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
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
import { Entidad } from '@models/entidad.model';
import { AlumnosComponent } from 'src/app/modules/alumnos/pages/alumnos/alumnos.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { alumnoEntidad } from '@models/alumnoEntidad.model';
import { Alumno, CrearAlumnoDTO, Grado, Institucion } from '@models/alumno.model';
import { GlobalService } from '@services/global.service';
import { switchMap } from 'rxjs/operators';
import { GradoService } from '@services/grado.service';
import { InstitucionService } from '@services/institucion.service';


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
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class RegistrarAlumnoComponent implements OnInit {
  formAlumno: FormGroup;
  tituloAccion: string = 'Nuevo';
  botonAccion: string = 'Guardar';

  listaAlumnos: Entidad[] = [];
  dataSource = new MatTableDataSource<Entidad>();
  alumnosMasivos: CrearAlumnoDTO[] = [];

  grados: Grado[] = []; 
  instituciones: Institucion[] = []; 

  aluProfe = {
    id: 0,
    gradoId: 0,
    año: 0,
    institucionId: 0,
    entidadId: 0,
    profesorId: 0,
  };

  constructor(
    private _dialogoReferencia: MatDialogRef<RegistrarAlumnoComponent>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _entidadService: EntidadService,
    private _alumnosService: AlumnosService,
    private globalService: GlobalService,
    private gradoService: GradoService,
    private institucionService: InstitucionService,
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
      gradoId: ['', Validators.required],
      año: ['', Validators.required],
      institucionId: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {
    // Cargar los grados al inicializar
    this.gradoService.getGrados().subscribe({
      next: (grados) => {
        this.grados = grados;
        console.log('Grados cargados:', grados);
      },
      error: (err) => console.error('Error al cargar grados', err)
    });
  
    // Cargar las instituciones al inicializar
    this.institucionService.getInstituciones().subscribe({
      next: (instituciones) => {
        this.instituciones = instituciones;
        console.log('Instituciones cargadas:', instituciones);
      },
      error: (err) => console.error('Error al cargar instituciones', err)
    });
  
    if (this.dataAlumno) {
      this.formAlumno.patchValue({
        nombre: this.dataAlumno.nombre,
        apellido: this.dataAlumno.apellido,
        fechaNacimiento: moment(this.dataAlumno.fechaNacimiento, 'DD/MM/YYYY'),
        sexo: this.dataAlumno.sexo,
        telefono: this.dataAlumno.telefono,
        direccion: this.dataAlumno.direccion,
        nroDocumento: this.dataAlumno.nroDocumento,
      });
  
      this._alumnosService.getAlumnoByEntidadID(this.dataAlumno.id).subscribe({
        next: (alumno: Alumno) => {
          this.formAlumno.patchValue({
            gradoId: alumno.gradoId,  
            año: alumno.año,
            institucionId: alumno.institucionId 
          });
          console.log('Detalles del alumno cargado en el formulario:', this.formAlumno.value);
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
              this.aluProfe.gradoId = this.formAlumno.value.grado;
              this.aluProfe.año = parseInt(this.formAlumno.value.año, 10);
              this.aluProfe.institucionId = this.formAlumno.value.institucion;
    
              const nuevoAlumno: CrearAlumnoDTO = {
                gradoId: this.formAlumno.value.gradoId,  // Enviamos solo el ID
                año: this.aluProfe.año,
                institucionId: this.formAlumno.value.institucionId,  // Enviamos solo el ID
                entidadId: this.aluProfe.entidadId,
                profesorId: this.aluProfe.profesorId,
              };
    
              console.log('Datos que se enviarán al POST sin el id:', nuevoAlumno);
    
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
                  this.aluProfe.gradoId = this.formAlumno.value.gradoId;
                  this.aluProfe.año = parseInt(this.formAlumno.value.año, 10);
                  this.aluProfe.institucionId = this.formAlumno.value.institucionId;
                  this.aluProfe.id = alumno.id;
          
                  //console.log('Datos que se enviarán al PUT:', this.aluProfe);
          
                  // Actualizar alumno, pasando el ID en la URL y los demás datos en el cuerpo
                  return this._alumnosService.updateAlumno(this.aluProfe.id, {
                    gradoId: this.formAlumno.value.gradoId,
                    año: parseInt(this.formAlumno.value.año, 10),
                    institucionId: this.formAlumno.value.institucionId,
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

}
