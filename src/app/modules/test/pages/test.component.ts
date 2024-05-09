import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {

  palabras = ['Perro', 'Gato', 'Leon', 'Raton']
  

  constructor() { }

  ngOnInit() {
  }

}