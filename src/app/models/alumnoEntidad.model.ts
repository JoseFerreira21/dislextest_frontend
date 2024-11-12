export interface alumnoEntidad {
    alumnoId: number,
    id: number,
    tipoEntidad: string,
    nombre: string,
    apellido?: string,
    fechaNacimiento?: string,
    sexo: string,
    edad?: string,
    año?: number,
    telefono?: string,
    direccion?: string,
    nroDocumento?: string,
    realizoTest?: string,
    usuarioId?: number | null;
}
