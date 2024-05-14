import { Component, OnInit } from '@angular/core';

import { DataSourceResultados } from './data-source';

import { ResultadoTestService } from '@services/resultadotest.service';
import { ResultadoTest } from '@models/resultadotest.model';
import { TokenService } from '@services/token.service';
import { ProfesorService } from '@services/profesor.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
})
export class ResultadosTableComponent implements OnInit {
  resultados: any;
  resultadosItems: [] = [];
  dataSource = new DataSourceResultados();
  columns: string[] = [
    'id',
    'nombre_alumno',
    'nro_documento' /*, 'nombrealumno', 'edad', 'direccion', 'ci'*/,
  ];

  constructor(
    private resultadoTestService: ResultadoTestService,
    private _tokenService: TokenService,
    private _profesorService: ProfesorService
  ) {
    this.getResultados();
  }

  getResultados() {
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
            console.log('ID del profesor:', idProfesor);

            this.resultadoTestService
              .getResultados(idProfesor)
              .subscribe((resultados: ResultadoTest[]) => {
                this.dataSource.init(resultados);
                console.log('resultados:', resultados);
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

  ngOnInit(): void {}
}
