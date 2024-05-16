import { Component } from '@angular/core';

@Component({
  selector: 'app-test-formar-palabra',
  templateUrl: './test-formar-palabra.component.html',
  styleUrls: ['./test-formar-palabra.component.scss']
})
export class TestFormarPalabraComponent {

  palabras = ['perro', 'gato', 'leon', 'raton']
  respuestas: string[] = [];

  constructor() { }

  ngOnInit() {
    //console.log(this.palabras);
    this.respuestas = new Array(this.palabras.length);
  }

}
