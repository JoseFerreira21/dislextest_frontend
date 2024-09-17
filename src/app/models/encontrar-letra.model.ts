export interface EncontrarLetras {
  areaId:               number;
  ejercicioId:          number;
  descripcionEjercicio: string;
  ejercicioOpcionesId:  number;
  palabras:             Palabra[];
  respuesta:            string;
  puntos:               number;
  // Nuevos atributos añadidos
  pEsperado: number;
  pMinimo: number;
  observacionR: string;
  observacionSR: string;
}

export interface Palabra {
  ejercicioOpcionesId: number;
  palabra: string;
  letras: Letra[];
  grupo: number;
  validez: string; 
}

export interface Letra {
  letra: string;
  estado: boolean;
  valido: boolean;
  validez: string; 
}
