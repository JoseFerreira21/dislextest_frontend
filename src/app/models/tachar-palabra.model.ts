export interface TacharPalabraEstructura {
  areaId:               number;
  ejercicioId:          number;
  descripcionEjercicio: string;
  ejercicioOpcionesId:  number;
  palabras:             Palabra[];
  respuesta:            string;
}

export interface Palabra {
  ejercicioOpcionesId: number;
  opcion:              string;
  estado:              boolean;
  grupo:               number;
}
