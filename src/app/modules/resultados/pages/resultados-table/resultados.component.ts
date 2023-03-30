import { Component, OnInit } from '@angular/core';
import { TestService } from '../../../../services/test.service';
import { HttpClient } from '@angular/common/http';

import { ResultadoTestService } from '@services/resultadotest.service';

import { environment } from '@environments/environment';

import { TokenService } from '@services/token.service';
import { ResultadoTest } from '@models/resultadotest.model';



@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})
export class ResultadosComponent implements OnInit {

  resultados: any;
  resultadosItems: [] = [];

  constructor(private resultadoTestService: ResultadoTestService) { 

    this.obtenerResultados();
  
  }

  apiUrl = environment.API_URL;

  obtenerResultados() {
    this.resultadoTestService.getResultados()
    .subscribe((data) => {
      this.resultados = data;
      console.log('Resultados: ', this.resultados);
    });

  }


  ngOnInit(): void {
  }

}
