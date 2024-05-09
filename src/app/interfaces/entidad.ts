export interface Entidad {
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
