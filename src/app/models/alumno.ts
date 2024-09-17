export interface Alumno {
    id: number;  
    grado: string;
    año: number;
    institucion: string;
    entidadId: number;
    profesorId: number;
  }

  export interface CrearAlumnoDTO {
    grado: string;
    año: number;
    institucion: string;
    entidadId: number;
    profesorId: number;
  }
