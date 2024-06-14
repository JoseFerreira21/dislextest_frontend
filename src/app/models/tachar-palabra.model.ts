// export interface OpcionesPalabras {
//     texto: string;
//     estado: boolean;
// }
// export interface TacharPalabra {
//     buscar: string;
//     opcionesPalabras: OpcionesPalabras[];
// }

export interface TacharPalabraEstructura {
    palabra: string[];
    respuesta: string;
    estado: boolean;
  }
  

  [
    {
      "palabras" : [
        {
        "opcion": "cabello",
        "estado":false
        },
        {
        "opcion":"bello",
        "estado":false
        },
              {
        "opcion":"cabeza",
        "estado":false
        },
              {
        "opcion":"caballo",
        "estado":false
        }
      ],
      "respuesta": "caballo"
    },
    {
      "palabras" : [
        {
        "opcion": "golazo",
        "estado":false
        },
        {
        "opcion":"guisado",
        "estado":false
        },
              {
        "opcion":"gusano",
        "estado":false
        },
              {
        "opcion":"goma",
        "estado":false
        }
      ],
      "respuesta": "gusano"
    }
  ]