import { Component, OnInit } from '@angular/core';
import { TestService } from '../../../../services/test.service';
import { HttpClient } from '@angular/common/http';

import { ResultadoTestService } from '@services/resultadotest.service';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { ProfesorService } from '@services/profesor.service';
import { DataSourceResultados } from './data-source';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
})
export class ResultadosComponent implements OnInit {
  resultados: any;
  resultadosItems: [] = [];
  dataSource = new DataSourceResultados();

  constructor(
    private _resultadoTestService: ResultadoTestService,
    private _tokenService: TokenService,
    private _profesorService: ProfesorService
  ) {
    this.obtenerResultados();
  }

  apiUrl = environment.API_URL;

  obtenerResultados() {
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
            this._resultadoTestService
              .getResultados(idProfesor)
              .subscribe((data) => {
                this.resultados = data;
                //console.log('Resultados: ', this.resultados);
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
