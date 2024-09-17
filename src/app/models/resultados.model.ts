export interface ResultadoTest {
  indicador:   string;
  observacion: string;
  alumnoId:    number;
  profesorId:  number;
  tiempoTotal: number;  
}

export interface ResultadoTestPost {
  id:          number;
  indicador:   string;
  observacion: string;
  alumnoId:    number;
  profesorId:  number;
  createAt:    Date;
  updateAt:    Date;
}