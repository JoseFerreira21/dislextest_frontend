import { Component, OnInit } from '@angular/core';
import { Palabra } from '@models/formar-palabras.model';
import { TestService } from '@services/test.service';


@Component({
  selector: 'app-test-formar-palabra',
  templateUrl: './test-formar-palabra.component.html',
  styleUrls: ['./test-formar-palabra.component.scss']
})
export class TestFormarPalabraComponent implements OnInit {
  palabras: Palabra[] = [];
  respuestas: string[] = [];

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.cargarPalabras();
  }

  cargarPalabras() {
    this.testService.getObtenerPalabras().subscribe({
      next: (data: Palabra[]) => {
        this.palabras = data;
        console.log('Palabras del service: ', this.palabras);
      },
      error: (error) => console.error('Error al consultar al service: ', error)
    });
  }
}
