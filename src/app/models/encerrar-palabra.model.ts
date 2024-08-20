export interface EncerrarPalabras {
  respuesta: string;
  opciones: Opcion[];
}
export interface Opcion {
  palabra: string;
  estado: boolean,
}
