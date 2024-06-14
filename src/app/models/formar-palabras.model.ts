// export interface Palabra {
//   text: string;
//   letters: Letter[];
//   lettersRespuesta: Letter[];
// }

// export interface Letter {
//   letter: string;
//   selected: boolean;
// }

export interface Palabra {
  ejercicioId:          number;
  descripcionEjercicio: string;
  ejercicioOpcionesId:  number;
  palabra:              string;
  letras:               Letra[];
  letrasRespuesta:      Letra[];
  respuesta:            string;
}

export interface Letra {
  letra:  string;
  estado: boolean;
}
