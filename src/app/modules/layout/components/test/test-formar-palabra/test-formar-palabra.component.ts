import { Component, OnInit } from '@angular/core';
import { Palabra, Letra } from '@models/formar-palabras.model';
import { TestService } from '@services/test.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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

  seleccionarLetra(palabra: Palabra, letter: Letra) {
    if (!letter.estado) {
      const lugarLibre = this.buscarLugarLibre(palabra.letrasRespuesta);
      if (lugarLibre !== -1) {
        palabra.letrasRespuesta[lugarLibre] = { ...letter };
        letter.estado = true;
      }
    }
  }

  deSeleccionarLetra(palabra: Palabra, letter: Letra, index: number) {
    if (palabra.letrasRespuesta[index].letra === letter.letra) {
      palabra.letrasRespuesta[index] = { letra: '', estado: false };
      const originalLetter = palabra.letras.find(l => l.letra === letter.letra && l.estado);
      if (originalLetter) {
        originalLetter.estado = false;
      }
    }
  }

  buscarLugarLibre(letrasRespuesta: Letra[]): number {
    for (let index = 0; index < letrasRespuesta.length; index++) {
      if (letrasRespuesta[index].letra === '') {
        return index;
      }
    }
    return -1;
  }

  guardar() {
    console.log(this.palabras);
    for (let index = 0; index < this.palabras.length; index++) {
      const element = this.palabras[index];
      console.log(element.letras);
      console.log(this.aparicionAleatoria(element) + `-` + this.respuestaPalabra(element));
    }
  }

  aparicionAleatoria(element: Palabra): string {
    let retorno = '';
    for (let index = 0; index < element.letras.length; index++) {
      const letter = element.letras[index].letra;
      retorno += letter;
    }
    return retorno;
  }

  respuestaPalabra(element: Palabra): string {
    let retorno = '';
    for (let index = 0; index < element.letrasRespuesta.length; index++) {
      const letrasRespuesta = element.letrasRespuesta[index].letra;
      retorno += letrasRespuesta;
    }
    return retorno;
  }

  cargarPalabras() {
    this.testService.getObtenerPalabras().subscribe({
      next: (data: Palabra[]) => {
        this.palabras = data;
        this.palabras.forEach(p => {
          p.letrasRespuesta = Array(p.letras.length).fill({ letra: '', estado: false });
        });
        console.log('Palabras del service: ', this.palabras);
      },
      error: (error) => console.error('Error al consultar al service: ', error)
    });
  }

  guardarResultado() {
    console.log('Resultado guardado de Formar Palabras.');
  }
}

