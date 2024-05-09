export interface alumnoEntidad {
    alumnoId: number,
    id: number,
    tipoEntidad: string,
    nombre: string,
    apellido?: string,
    fechaNacimiento?: Date,
    edad?: string,
    telefono?: string,
    direccion?: string,
    nroDocumento?: string,
    usuarioId?: number
}
