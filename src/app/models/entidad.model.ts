export interface Entidad {
    tipoEntidad?: string,
    nombre: string,
    apellido?: string,
    fechaNacimiento?: string,
    sexo?: string,
    telefono?: string,
    direccion?: string,
    nroDocumento?: string,
    usuarioId?: number | null;
}

export interface EntidadUsuario {
    id: number,
    tipoEntidad?: string,
    nombre: string,
    apellido?: string,
    fechaNacimiento?: string,
    sexo?: string,
    telefono?: string,
    direccion?: string,
    nroDocumento?: string,
    usuarioId?: number | null;
}
