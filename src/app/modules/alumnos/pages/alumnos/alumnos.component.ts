import { AlumnosService } from '@services/alumnos.service';
import { AuthService } from '@services/auth.service';
import { ProfesorService } from '@services/profesor.service';
import { TokenService } from '@services/token.service';

import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Entidad } from 'src/app/interfaces/entidad';
import { EntidadService } from '@services/entidad.service';

//Para trabajar con iconos de material
import { MatIconModule } from '@angular/material/icon';
//Para trabajar con modal de material
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatGridListModule } from '@angular/material/grid-list';
import { alumnoEntidad } from 'src/app/interfaces/alumnoEntidad';
import { RegistrarAlumnoComponent } from 'src/app/modules/dialogs/registrar-editar-alumno/pages/registrar-editar-alumno.component';
import { EliminarAlumnoComponent } from 'src/app/modules/dialogs/eliminar-alumno/pages/eliminar-alumno.component';

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
  ];
  dataSource = new MatTableDataSource<alumnoEntidad>();
  constructor(
    private entidadService: EntidadService,
    private alumnoService: AlumnosService,
    private _profesorService: ProfesorService,
    private _tokenService: TokenService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.mostrarAlumnosDelProfesor();
  }

  mostrarAlumnosDelProfesor() {
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
            
            this.alumnoService.getAlumnosDelProfesor(idProfesor).subscribe({
              next: (dataResponse) => {
                //console.log(dataResponse);
                this.dataSource.data = dataResponse;
              },
              error: (e) => {
                console.error('Error al obtener alumnos del profesor:', e);
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
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
}
