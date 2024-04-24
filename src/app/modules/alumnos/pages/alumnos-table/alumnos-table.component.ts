import { Component } from '@angular/core';

import { DataSourceUser } from './data-source';

import { AlumnosService } from '@services/alumnos.service';
import { Alumnos } from '@models/alumnos.model';

@Component({
  selector: 'app-alumnos-table',
  templateUrl: './alumnos-table.component.html'
})
export class AlumnosTableComponent  {

  dataSource = new DataSourceUser();
  columns: string[] = ['id', 'nombrealumno', 'edad', 'direccion', 'ci'];

  constructor(
    private alumnosService: AlumnosService,
  ) {
}

  ngOnInit(): void{
    const idProfesor = 1; // Aquí debes establecer el idProfesor según tu lógica
    this.alumnosService.getAlumnosDelProfesor(idProfesor)
    .subscribe((alumnos: Alumnos[]) => {
      this.dataSource.init(alumnos);
    })
  }

}
