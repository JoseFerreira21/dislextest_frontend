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

import { DialogAddEditEntidadComponent } from '../../../dialog-add-edit-entidad/pages/dialog/dialog-add-edit-entidad.component';
import { MatGridListModule } from '@angular/material/grid-list';


@Component({
  selector: 'alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatGridListModule ],
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

  constructor(private entidadService: EntidadService, public dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.getEntidades();
  }

  getEntidades() {
    this.entidadService.getEntidadList().subscribe({
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

  dialogoNuevaEntidad(){
    this.dialog.open(DialogAddEditEntidadComponent);
  }
}
