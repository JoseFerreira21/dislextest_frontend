export interface ResultadoTest {
  indicador:   string;
  observacion: string;
  alumnoId:    number;
  profesorId:  number;
}
export interface ResultadoTestPost {
  indicador:   string;
  observacion: string;
  alumnoId:    number;
  profesorId:  number;
  id:          number;
  createAt:    Date;
  updateAt:    Date;
}
