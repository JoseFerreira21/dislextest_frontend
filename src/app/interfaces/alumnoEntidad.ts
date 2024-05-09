export interface alumnoEntidad {
    alumnoId: number,
    id: number,
    tipoEntidad: string,
    nombre: string,
    apellido?: string,
    fechaNacimiento?: Date,
    telefono?: string,
    direccion?: string,
    nroDocumento?: string,
    usuarioId?: number
}
