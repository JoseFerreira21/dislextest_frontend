export interface LetrasDesordenadas {
      ejercicioId:          number;
      descripcionEjercicio: string;
      ejercicioOpcionesId:  number;
      palabra:              string;
      letras:               Letra[];
      letrasRespuesta:      Letra[];
      respuesta:            string;
      areaId:               number;
      validez:              string;
      // Nuevos atributos añadidos
      pEsperado: number;
      pMinimo: number;
      observacionR: string;
      observacionSR: string;
  }
  
  export interface Letra {
    letra:  string;
    estado: boolean;
  }