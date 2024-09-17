export interface ResultadoItem {
  pObtenido:       number;
  indicador:       string;
  observacion:     string;
  tiempoEmpleado:  number;
  AreaId:          number;
  ResultadoTestId: number;
}
export interface ResultadoItemRespuesta {
  pObtenido:     number;
  indicador:     string;
  observacion:   string;
  tiempoEmpleado:  number;
  resultadotest: Resultadotest;
  area:          Area;
  id:            number;
  createAt:      Date;
  updateAt:      Date;
}

export interface Area {
  id:            number;
  descripcion:   string;
  pEsperado:     number;
  pMinimo:       string;
  observacionSR: string;
  observacionR:  string;
  createAt:      Date;
  updateAt:      Date;
}

export interface Resultadotest {
  id:          number;
  indicador:   string;
  observacion: string;
  tiempoEmpleado:  number;
  alumnoId:    number;
  profesorId:  number;
  createAt:    Date;
  updateAt:    Date;
}
