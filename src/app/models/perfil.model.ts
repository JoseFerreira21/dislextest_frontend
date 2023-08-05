export interface Perfil {
    nombre: string;
    apellido: string;
    fechaNacimiento: Date;
    telefono: string;
    direccion: string;
    nroDocumento: string;
    //materia: string;
    createAt: Date;
    updateAt: Date;
    usuarioId: number;
}