export interface Letra {
  letra: string;
  estado: boolean;
}

export interface Palabra {
  palabra: string;
  letras: Letra[];
}

export interface EncontrarLetra {
  respuesta: string;
  palabras: Palabra[];
}
