import { AlumnosService } from '@services/alumnos.service';
import { AuthService } from '@services/auth.service';

import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Entidad } from '@models/entidad.model';
import { EntidadService } from '@services/entidad.service';
import { GlobalService } from '@services/global.service';

//Para trabajar con iconos de material
import { MatIconModule } from '@angular/material/icon';
//Para trabajar con modal de material
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatGridListModule } from '@angular/material/grid-list';
import { alumnoEntidad } from '@models/alumnoEntidad.model';
import { RegistrarAlumnoComponent } from 'src/app/modules/layout/components/dialogs/registrar-editar-alumno/registrar-editar-alumno.component';
import { EliminarAlumnoComponent } from 'src/app/modules/layout/components/dialogs/eliminar-alumno/eliminar-alumno.component';

import { Router } from '@angular/router';
import { BienvenidaAlumnoComponent } from 'src/app/modules/layout/components/dialogs/bienvenida-alumno/bienvenida-alumno.component';
import { TextToSpeechService } from '@services/text-to-speech.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AlumnosDelProfesor } from '@models/alumnos-del-profesor.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatGridListModule,
    CommonModule,
    MatSnackBarModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
  entryComponents: [BienvenidaAlumnoComponent], // Para asegurar que el modal esté disponible
})
export class AlumnosComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'ID',
    'Nombre',
    'Apellido',
    'Fecha de Nacimiento',
    'Edad',
    'Sexo',
    'Teléfono',
    'Dirección',
    'N° Documento',
    'Acciones',
    'Comenzar',
    'realizoTest',
  ];
  dataSource = new MatTableDataSource<AlumnosDelProfesor>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  rutaImagenCheck: string = 'assets/images/';

  grados: string[] = [];
  instituciones: string[] = [];
  gradoSeleccionado: string | null = null;
  institucionSeleccionada: string | null = null;
  filterText: string = '';

  constructor(
    private router: Router,
    private entidadService: EntidadService,
    private alumnoService: AlumnosService,
    private globalService: GlobalService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private textToSpeechService: TextToSpeechService
  ) {}

  ngOnInit(): void {
    this.mostrarAlumnosDelProfesor();
  }

  mostrarAlumnosDelProfesor() {
    this.globalService.getProfesorId().subscribe({
      next: (profesorId) => {
        if (profesorId !== null) {
          this.alumnoService.getAlumnosDelProfesor(profesorId).subscribe({
            next: (dataResponse: AlumnosDelProfesor[]) => {
              this.dataSource.data = dataResponse; // Asigna los datos directamente

              // Extrae los nombres de grados e instituciones para los filtros
              this.grados = Array.from(
                new Set(this.dataSource.data.map((a) => a.grado.descripcion))
              );
              this.instituciones = Array.from(
                new Set(this.dataSource.data.map((a) => a.institucion.descripcion))
              );
            },
            error: (e) => console.error('Error al obtener alumnos:', e),
          });
        } else {
          console.error('No se pudo obtener el ID del profesor.');
        }
      },
      error: (e) => console.error('Error al obtener el ID del profesor:', e),
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: AlumnosDelProfesor) => {
      const matchesGrado = this.gradoSeleccionado
        ? data.grado.descripcion === this.gradoSeleccionado
        : true;
      const matchesInstitucion = this.institucionSeleccionada
        ? data.institucion.descripcion === this.institucionSeleccionada
        : true;
      const matchesNombre = this.filterText
        ? data.nombre.toLowerCase().includes(this.filterText.toLowerCase())
        : true;

      return matchesGrado && matchesInstitucion && matchesNombre;
    };

    this.dataSource.filter = Math.random().toString(); // Fuerza la actualización del filtro
  }

  limpiarFiltros() {
    this.institucionSeleccionada = null;
    this.gradoSeleccionado = null;
    this.filterText = ''; 
    
    // Restablece la lista filtrada a todos los resultados
    this.applyFilter();
  }

  dialogoNuevoAlumno() {
    this.dialog
      .open(RegistrarAlumnoComponent, {
        disableClose: true,
        width: '400px',
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'creado') {
          this.mostrarAlumnosDelProfesor();
        }
      });
  }

  dialogoEditarAlumno(dataAlumno: alumnoEntidad) {
    this.dialog
      .open(RegistrarAlumnoComponent, {
        disableClose: true,
        width: '400px',
        data: dataAlumno,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'editado') {
          this.mostrarAlumnosDelProfesor();
        }
      });
  }

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  dialogoEliminarAlumno(dataAlumno: alumnoEntidad) {
    this.dialog
      .open(EliminarAlumnoComponent, {
        disableClose: true,
        data: dataAlumno,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'eliminar') {
          this.entidadService.deleteEntidad(dataAlumno.id).subscribe({
            next: (data) => {
              this.mostrarAlerta('Alumno eliminado correctamente.', 'Listo');
              this.mostrarAlumnosDelProfesor();
            },
            error: (e) => {
              console.log(e);
            },
          });
        }
      });
  }

  comenzarEjercicio(alumno: any): void {
    const dialogRef = this.dialog.open(BienvenidaAlumnoComponent, {
      width: '300px',
      data: alumno,
    });

    this.textToSpeechService.speak('Bienvenido, ' + alumno.nombre);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //console.log('El juego ha comenzado para el alumno:', result.nombre);
        this.iniciarTest(result.alumnoId);
      }
    });
  }

  iniciarTest(alumnoId: number) {
    this.router.navigate(['/test'], { queryParams: { alumnoId: alumnoId } });
  }
}
