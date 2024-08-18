import { Component, OnInit } from '@angular/core';
import { ResultadoTestService } from '@services/resultadotest.service';
import { GlobalService } from '@services/global.service';
import { DataSourceResultados } from './data-source';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
})
export class ResultadosComponent implements OnInit {
  resultados: any;
  resultadosItems: [] = [];
  dataSource = new DataSourceResultados();

  constructor(
    private _resultadoTestService: ResultadoTestService,
    private globalService: GlobalService // Inyectamos GlobalService
  ) {
    this.obtenerResultados();
  }

  obtenerResultados() {
    this.globalService.getProfesorId().subscribe(profesorId => {
      if (profesorId !== null) {
        this._resultadoTestService.getResultados(profesorId).subscribe({
          next: (data) => {
            this.resultados = data;
            //console.log('Resultados: ', this.resultados);
          },
          error: (e) => {
            console.error('Error al obtener los resultados:', e);
          },
        });
      } else {
        console.error('No se pudo obtener el ID del profesor.');
      }
    });
  }

  ngOnInit(): void {}
}
