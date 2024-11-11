export interface ContarLetras {
    areaId:               number;
    ejercicioId:          number;
    descripcionEjercicio: string;
    ejercicioOpcionesId:  number;
    letra:                string; 
    cantidad:              string;
    respuesta:            string;
    validez:              string;
     // Nuevos atributos añadidos
     pEsperado: number;
     pMinimo: number;
     observacionR: string;
     observacionSR: string;
  }