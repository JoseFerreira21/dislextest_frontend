export interface TacharPalabraEstructura {
  areaId:               number;
  ejercicioId:          number;
  descripcionEjercicio: string;
  ejercicioOpcionesId:  number;
  palabras:             Palabra[];
  respuesta:            string;
  //validez:              string;
   // Nuevos atributos añadidos
   pEsperado: number;
   pMinimo: number;
   observacionR: string;
   observacionSR: string;
}

export interface Palabra {
  ejercicioOpcionesId: number;
  opcion:              string;
  estado:              boolean;
  grupo:               number;
  validez:             string;
}
