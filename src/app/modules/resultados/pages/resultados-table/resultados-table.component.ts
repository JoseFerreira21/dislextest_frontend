import { Component, OnInit } from '@angular/core';

import { DataSourceResultados } from './data-source';

import { ResultadoTestService } from '@services/resultadotest.service';
import { ResultadoTest } from '@models/resultadotest.model';

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

  constructor(private resultadoTestService: ResultadoTestService) {
    this.getResultados();
  }

  getResultados() {
    this.resultadoTestService
      .getResultados()
      .subscribe((resultados: ResultadoTest[]) => {
        this.dataSource.init(resultados);
      });
  }

  ngOnInit(): void {}
}
