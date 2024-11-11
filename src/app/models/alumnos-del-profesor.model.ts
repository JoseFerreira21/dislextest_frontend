export interface AlumnosDelProfesor {
    alumnoId: number;
    id: number;
    tipoEntidad: string;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    sexo: string;
    edad: string;
    telefono: string;
    direccion: string;
    nroDocumento: string;
    año: number;
    grado: {
      id: number;
      nombre: string;
    };
    institucion: {
      id: number;
      nombre: string;
    };
    realizoTest: string;
  }