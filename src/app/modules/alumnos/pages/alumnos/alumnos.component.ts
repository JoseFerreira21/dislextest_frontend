import { AlumnosService } from '@services/alumnos.service';
import { AuthService } from '@services/auth.service';

import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Entidad } from 'src/app/interfaces/entidad';
import { EntidadService } from '@services/entidad.service';
import { GlobalService } from '@services/global.service';

//Para trabajar con iconos de material
import { MatIconModule } from '@angular/material/icon';
//Para trabajar con modal de material
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatGridListModule } from '@angular/material/grid-list';
import { alumnoEntidad } from 'src/app/interfaces/alumnoEntidad';
import { RegistrarAlumnoComponent } from 'src/app/modules/layout/components/dialogs/registrar-editar-alumno/registrar-editar-alumno.component'; 
import { EliminarAlumnoComponent } from 'src/app/modules/layout/components/dialogs/eliminar-alumno/eliminar-alumno.component';

import { Router } from '@angular/router';
import { BienvenidaAlumnoComponent } from 'src/app/modules/layout/components/dialogs/bienvenida-alumno/bienvenida-alumno.component';
import { TextToSpeechService } from '@services/text-to-speech.service';

@Component({
  selector: 'alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatGridListModule,
  ],
  entryComponents: [BienvenidaAlumnoComponent] // Para asegurar que el modal esté disponible
})
export class AlumnosComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'ID',
    'Nombre',
    'Apellido',
    'Fecha de Nacimiento',
    'Edad',
    'Teléfono',
    'Dirección',
    'N° Documento',
    'Acciones',
    'Comenzar',
  ];
  dataSource = new MatTableDataSource<alumnoEntidad>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
    this.globalService.getProfesorId().subscribe(profesorId => {
      if (profesorId !== null) {
        this.alumnoService.getAlumnosDelProfesor(profesorId).subscribe({
          next: (dataResponse) => {
            this.dataSource.data = dataResponse;
          },
          error: (e) => {
            console.error('Error al obtener alumnos del profesor:', e);
          },
        });
      } else {
        console.error('No se pudo obtener el ID del profesor.');
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
      data: alumno
    
    });

    this.textToSpeechService.speak('Bienvenido, ' + alumno.nombre);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('El juego ha comenzado para el alumno:', result.nombre);
        this.iniciarTest(result.alumnoId);
      }
    });
  }

  iniciarTest(alumnoId: number) {
    this.router.navigate(['/test'], { queryParams: { alumnoId: alumnoId } });
  }
}