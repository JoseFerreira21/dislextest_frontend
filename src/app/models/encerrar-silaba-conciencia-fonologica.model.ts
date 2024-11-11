export interface EncerrarSilabaConcienciaFonologica {
    areaId:               number;
    ejercicioId:          number;
    descripcionEjercicio: string;
    ejercicioOpcionesId:  number;
    palabra:              string;
    palabraIncompleta:    string;
    opciones:             string[];  // Array de strings para las opciones
    respuesta:            string;
    validez:              string;
     // Nuevos atributos añadidos
     pEsperado: number;
     pMinimo: number;
     observacionR: string;
     observacionSR: string;
  }