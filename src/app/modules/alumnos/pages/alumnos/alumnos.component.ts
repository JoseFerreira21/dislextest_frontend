import { AlumnosService } from '@services/alumnos.service';
import { Alumnos } from '@models/alumnos.model';
import { AuthService } from '@services/auth.service';

import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Entidad } from 'src/app/interfaces/entidad';
import { EntidadService } from '@services/entidad.service';

//Para trabajar con iconos de material
import { MatIconModule } from '@angular/material/icon';
//Para trabajar con modal de material
import {MatDialog} from '@angular/material/dialog';
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
    imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatGridListModule]
})
export class AlumnosComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'ID',
    'Nombre',
    'Apellido',
    'Fecha de Nacimiento',
    'Teléfono',
    'Dirección',
    'N° Documento',
    'Acciones',
  ];
  dataSource = new MatTableDataSource<Entidad>();
  constructor(private entidadService: EntidadService, 
              private alumnoService: AlumnosService,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
    this.mostrarAlumnosDelProfesor();
  }

  mostrarAlumnosDelProfesor() {
    this.alumnoService.getAlumnosDelProfesor(1).subscribe({
      next: (dataResponse) => {
        console.log(dataResponse);
        this.dataSource.data = dataResponse;
      },
      error: (e) => {},
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  dialogoNuevoAlumno(){
    this.dialog.open(RegistrarAlumnoComponent, {
      disableClose:true,
      width:"500px"
    }).afterClosed().subscribe(resultado => {
      if (resultado === 'creado'){
        this.mostrarAlumnosDelProfesor();
      }
    });
  }

  dialogoEditarAlumno(dataAlumno: Entidad){
    this.dialog.open(RegistrarAlumnoComponent, {
      disableClose:true,
      width:"500px",
      data: dataAlumno
    }).afterClosed().subscribe(resultado => {
      if (resultado === 'editado'){
        this.mostrarAlumnosDelProfesor();
      }
    });
  }

  mostrarAlerta(msg: string, accion: string){
    this._snackBar.open(msg, accion, {
      horizontalPosition: "end",
      verticalPosition:"top",
      duration: 3000
    });
  }

  dialogoEliminarAlumno(dataAlumno: Entidad){
    this.dialog.open(EliminarAlumnoComponent, {
      disableClose:true,
      data: dataAlumno
    }).afterClosed().subscribe(resultado => {
      if (resultado === 'eliminado'){
        this.entidadService.deleteEntidad(dataAlumno.id).subscribe({
          next: (data)=>{
            this.mostrarAlerta("Alumno eliminado correctamente.", "Listo");
            this.mostrarAlumnosDelProfesor();
          }, error:(e)=> {
            console.log(e);
          }
        });
      }
    });
  }

}
