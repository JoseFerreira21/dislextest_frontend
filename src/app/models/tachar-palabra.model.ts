export interface OpcionesPalabras {
    texto: string;
    estado: boolean;
}
export interface TacharPalabra {
    buscar: string;
    opcionesPalabras: OpcionesPalabras[];
}