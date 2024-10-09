//Esta informacion sirve para crear o actualizar desde el cliente
export interface IBlobData {
   idblobdata: number,
   value: number,
   date: string
}

export interface IStadistics {
   min: number,
   max: number,
   mean: number,
   iqr: number,
   limitMin: number,
   limitMax: number
}

//Esta informacion viene del servidor
export interface IBlobData_Database {
   idblobdata: number,
   value: number[],
   register_date: string[],
   description: string,
   full: boolean,
   stadistic: IStadistics
}

//Esta informacion sirve para graficar en tabla
export interface IBlobData_Table {
   valor: number;
   fecha: string;
}