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


  palabrasIzquierda = [
    {
      text: 'gato',
      letters: [
        { letter: 'g', selected: false },
        { letter: 't', selected: false },
        { letter: 'o', selected: false },
        { letter: 'a', selected: false },
      ],
      lettersRespuesta: [
        { letter: '', selected: false },
        { letter: '', selected: false },
        { letter: '', selected: false },
        { letter: '', selected: false },
      ],
    },
    {
      text: 'perro',
      letters: [
        { letter: 'p', selected: false },
        { letter: 'r', selected: false },
        { letter: 'r', selected: false },
        { letter: 'e', selected: false },
        { letter: 'o', selected: false },
      ],
      lettersRespuesta: [
        { letter: '', selected: false },
        { letter: '', selected: false },
        { letter: '', selected: false },
        { letter: '', selected: false },
        { letter: '', selected: false },
      ],
    },
    {
      text: 'loen',
      letters: [
        { letter: 'l', selected: false },
        { letter: 'o', selected: false },
        { letter: 'e', selected: false },
        { letter: 'n', selected: false },
      ],
      lettersRespuesta: [
        { letter: '', selected: false },
        { letter: '', selected: false },
        { letter: '', selected: false },
        { letter: '', selected: false },
      ],
    },
    {
      text: 'spao',
      letters: [
        { letter: 's', selected: false },
        { letter: 'p', selected: false },
        { letter: 'a', selected: false },
        { letter: 'o', selected: false },
      ],
      lettersRespuesta: [
        { letter: '', selected: false },
        { letter: '', selected: false },
        { letter: '', selected: false },
        { letter: '', selected: false },
      ],
    },
  ];

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.cargarPalabras();
  }
  
  seleccionarLetra(palabra: any, letter: any) {
    console.log(palabra);
    console.log(letter);
    if (!letter.selected) {
      letter.selected = !letter.selected;
      palabra.lettersRespuesta [this.buscarLugarLibre(palabra.lettersRespuesta) ] = letter;

    } 
}

deSeleccionarLetra(palabra: any, letter: any) {
  console.log(palabra);
  console.log(letter);
  if (!letter.selected) {
    letter.selected = !letter.selected;
    palabra.lettersRespuesta [this.buscarLugarLibre(palabra.lettersRespuesta) ] = letter;

  } 
}

  buscarLugarLibre = (lettersRespuesta : any) :number =>{
    console.log(lettersRespuesta);
    let retorno = 0;
    for (let index = 0; index < lettersRespuesta.length; index++) {
      const element = lettersRespuesta[index].letter;
      if (element == ''){
        retorno = index;
        break;
      }
    }
    return retorno;
  } 

  guardar(){
    console.log(this.palabrasIzquierda);
    for (let index = 0; index < this.palabrasIzquierda.length; index++) {
      const element = this.palabrasIzquierda[index];
      console.log(element.letters);
      console.log(this.aparicionAleatoria(element) + `-` + this.respuestaPalabra(element));
    }
  }

  aparicionAleatoria = (element : any) :any =>{
   
    let retorno = '';
    for (let index = 0; index < element.letters.length; index++) {
      const letter = element.letters[index].letter;
      retorno += letter;
    }
    return retorno;
  } 

  respuestaPalabra = (element : any) :any =>{
   
    let retorno = '';
    for (let index = 0; index < element.lettersRespuesta.length; index++) {
      const lettersRespuesta = element.lettersRespuesta[index].letter;
      retorno += lettersRespuesta;
    }
    return retorno;
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
