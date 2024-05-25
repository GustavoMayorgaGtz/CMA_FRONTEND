import { HttpErrorResponse } from "@angular/common/http";
import { IBlobData, IBlobData_Database } from "../interfaces/BlobData/blobdatainterfaces";
import { VarsService } from "../service/vars";

export class BLOBDATA {

    constructor(private vars: VarsService) { }

    /**
     * Funcion para retornar un conjunto de datos por medio de un espacio virtual, consulta por id
     * @param idblobdata Pasa como parametro el id del blob data para traer la informacion de la api
     * @returns IBlobData_Database
     */
    getBlobData(idblobdata: number) {
        return new Promise<IBlobData_Database>((resolve, reject) => {
            this.vars.getBlobDataById(idblobdata).subscribe((response) => {
                resolve(response);
            }, (err: HttpErrorResponse) => {
                reject(err);
            })
        })
    }


    /**
     * Funcion para insertar un nuevo valor en el espacio virtual
     * @param body es un conjunto de datos que me manda el id, el value actual y la fecha actual para poder guardar en el espacio virtual
     */
    setNewValueBlobData(body: IBlobData) {
        return new Promise((resolve, reject) => {
            this.vars.setValueBlobData(body).subscribe((response) => {
                resolve(true);
            }, (err: HttpErrorResponse) => {
                resolve(false);
            })
        })
    }
}