export interface Alumno {
  id: number;
  gradoId: number;
  año: number;
  institucionId: number;   
  entidadId: number;
  profesorId: number;
}

export interface CrearAlumnoDTO {
  gradoId: number;   // Necesitamos solo el ID al crear
  año: number;
  institucionId: number;   // Necesitamos solo el ID al crear
  entidadId: number;
  profesorId: number;
}

export interface Grado {
  id: number;
  descripcion: string;
}

export interface Institucion {
  id: number;
  descripcion: string;
}
