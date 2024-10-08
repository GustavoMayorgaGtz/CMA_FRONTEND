import { HttpErrorResponse } from "@angular/common/http";
import { jsonLevel } from "../interfaces/interfaces";
import { VarsService } from 'src/app/service/vars';
import { AlertService } from "../service/alert.service";
import { IJsonBodyVariable_Constructor, IJsonVariable, IJsonVariable_Create } from "../interfaces/JsonEndpointsInterfaces/JsonEndpointI";
import { EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

export class JsonVariableClass {

    //OUTPUTS
    public output_show_datos: EventEmitter<boolean> = new EventEmitter();
    public output_show_seguridad: EventEmitter<boolean> = new EventEmitter();
    public output_show_jsonViewer: EventEmitter<boolean> = new EventEmitter();
    public output_show_variableCreada: EventEmitter<boolean> = new EventEmitter();

    private jsonFormatter: jsonLevel[] = [];
    private token: string = "";
    private originalJson: any;
    private lastLevel: number = 0;
    private output: any;
    private idxElements: number = -1;
    private lastidx: number = 0;
    private auxKeyArr: string[] = [];
    private keysArr: string[] = [];
    private idxKeySelected: number = 0;
    private UrlUsed: string = "";
    private body_query: IJsonBodyVariable_Constructor[] = [{ key: '', value: '' }];



    
    constructor
        (private vars_service: VarsService
            , private router: Router
            , private alertService: AlertService
        ) {}













    /**
     * Funcion para transpilar una expresion
     * @param nombre 
     * @param url 
     * @param metodo 
     * @param body 
     * @param token 
     */
    saveVariable(nombre: string, url: string, metodo: string, body: Object, token: string, noAviableNames: string[]) {
        const body_toCreate: IJsonVariable_Create = {
            name: nombre,
            url,
            method: metodo,
            body_json: body,
            token_bearer: token,
            key_json: this.getJsonFormatterArray[this.getidxKeySelected].name,
            father_keys_json_array: this.getkeysArr
        }
        const enableName = noAviableNames.indexOf(nombre);
        if( enableName !== -1){
            this.alertService.setMessageAlert("Nombre repetido, cambia el nombre de la variable.");
        }else{
            const id_user = sessionStorage.getItem('idUser');
            if(id_user){
                this.vars_service.create_Json_Var(body_toCreate, parseInt(id_user)).subscribe((data) => {
                    this.alertService.setMessageAlert("Variable creada");
                    this.output_show_variableCreada.emit(true);
                    this.clearData();
                }, (err: HttpErrorResponse) => {
                    console.log("Error al crear la variable json")
                    this.alertService.setMessageAlert("La variable no fue creada");
                });
            }else{
                this.router.navigate(['/login']);
            }
        }
    }













    /**
     * Es la primera funcion llama a lanzar a las demas funciones para analizar el contenido entrante
     * @param data Object
     */
    useData(data: Object) {
        if (data) {
            this.jsonGetKeys(data, 1, "raiz", -1);
            this.originalJson = data;
        }
    }














    /**
    * Funcion para obtener las llaves seleccionado 
    * @param object 
    * @param actualLevel 
    * @param fatherName 
    */
    jsonGetKeys(object: Object, actualLevel: number, fatherName: string, Fatheridx: number) {
        if (this.lastLevel < actualLevel) {
            this.lastLevel = actualLevel;
        }
        if (object) {
            const keys = Object.keys(object);
            keys.forEach((key: string, idx) => {

                const auxObj = object as any;
                const actualValue = auxObj[key];
                const type = typeof (actualValue);

                if (Array.isArray(actualValue)) {
                    //Arreglo
                    //Comprobacion
                    this.idxElements++;
                    this.lastidx = this.idxElements;
                    this.insertarElementoJson(actualLevel, key, type, actualValue, fatherName, Fatheridx);
                    this.idxElements++;
                    this.insertarElementoJson(actualLevel, "[", type, actualValue, fatherName, Fatheridx);
                    this.jsonGetKeys(actualValue, (actualLevel + 1), key, this.lastidx);
                    this.idxElements++;
                    this.insertarElementoJson(actualLevel, "]", type, actualValue, fatherName, Fatheridx);
                } else if (type == 'object') {
                    //Objeto
                    //Insertar el nuevo valor
                    this.idxElements++;
                    this.lastidx = this.idxElements;
                    this.insertarElementoJson(actualLevel, key, type, actualValue, fatherName, Fatheridx);
                    this.idxElements++;
                    this.insertarElementoJson(actualLevel, "{", type, actualValue, fatherName, Fatheridx);
                    this.jsonGetKeys(actualValue, (actualLevel + 1), key, this.lastidx);
                    this.idxElements++;
                    this.insertarElementoJson(actualLevel, "}", type, actualValue, fatherName, Fatheridx);
                } else {
                    //Elemento de otro tipo
                    this.idxElements++;
                    this.insertarElementoJson(actualLevel, key, type, actualValue, fatherName, Fatheridx);
                }
            })
        }
    }






    /**
     * Realizar la peticion de la variable entrante
     * @param variable 
     */
    doQuery(variable: IJsonVariable) {
        const method = variable.method
        const url = variable.url;
        const body = variable.body;

        const father_keys_json_array = variable.father_keys_json_array;
        return new Promise((resolve, reject) => {
            switch (method) {
                case 'GET': {
                    this.vars_service.type_GET(url).subscribe((data) => {
                        var lastObject: any = data;
                        father_keys_json_array.forEach((key) => {
                            if (lastObject && lastObject.hasOwnProperty(key)) {
                                lastObject = lastObject[key];
                            }
                        });
                        resolve(lastObject)
                    }, (err: HttpErrorResponse) => {
                        reject(err)
                    })
                    break;
                }
                case 'POST': {
                    if (this.vars_service)
                        this.vars_service.type_POST(url, body).subscribe((data) => {
                            var lastObject: any = data;
                            father_keys_json_array.forEach((key) => {
                                if (lastObject && lastObject.hasOwnProperty(key)) {
                                    lastObject = lastObject[key];
                                }
                            });
                            resolve(lastObject)
                        }, (err: HttpErrorResponse) => {
                            reject(err)
                        })
                    break;
                }
                case 'PUT': {
                    if (this.vars_service)
                        this.vars_service.type_PUT(url, body).subscribe((data) => {
                        }, (err: HttpErrorResponse) => {

                        })
                    break;
                }
                case 'OPTIONS': {
                    if (this.vars_service)
                        this.vars_service.type_OPTIONS(url, body).subscribe((data) => {
                        }, (err: HttpErrorResponse) => {

                        })
                    break;
                }
                case 'DELETE': {
                    if (this.vars_service)
                        this.vars_service.type_DELETE(url, body).subscribe((data) => {
                        }, (err: HttpErrorResponse) => {

                        })
                    break;
                }
                case 'PATCH': {
                    if (this.vars_service)
                        this.vars_service.type_PATCH(url, body).subscribe((data) => {
                        }, (err: HttpErrorResponse) => {

                        })
                    break;
                }
                case 'HEAD': {
                    if (this.vars_service)
                        this.vars_service.type_HEAD(url, body).subscribe((data) => {
                        }, (err: HttpErrorResponse) => {

                        })
                    break;
                }
            }
        })
    }





    /**
    * Funcion para ingresar un nuevo item en el arreglo que se grafica en el json viewer
    * @param actualLevel number
    * @param key string
    * @param type string 
    * @param actualValue any
    * @param fatherName string
    */
    insertarElementoJson(actualLevel: number, key: string, type: string, actualValue: any, fatherName: string, fatherIdx: number) {
        this.jsonFormatter.push({
            level: actualLevel,
            name: key,
            type,
            value: actualValue,
            father: {
                idx: fatherIdx,
                nameFather: fatherName,
                level: (actualLevel - 1)
            }
        })
    }







    /**
    * Funcion para obtener a los indices padres del key seleccionado (usa recursividad)
    * @param idx number - Id de la direccion anterior
    */
    getDirection(idx: number, isFather: boolean) {
        if (isFather) {
            this.idxKeySelected = idx;
        }
        if (this.auxKeyArr.length == 0) {
            this.auxKeyArr.push(this.jsonFormatter[idx].name);
        }
        let padre = this.jsonFormatter[idx].father;
        this.auxKeyArr.push(padre.nameFather);
        if (padre.nameFather != "raiz") {
            this.getDirection(padre.idx, false);
        } else {
            this.keysArr = this.auxKeyArr;
            this.auxKeyArr = [];
            this.getValueJsonKey();
        }
    }







    /**
    * Funcion que regresa el valor del key que selecciono el usuario en el json viewer
    * @returns output:any valor del key seleccionado por el usuario
    */
    getValueJsonKey() {
        let value: any;
        let contador = false;
        this.keysArr.pop();
        this.keysArr.reverse();
        let sizeArray = this.keysArr.length;
        this.keysArr.forEach((key: string, idx: number) => {
            if (!contador) {
                if (key)
                    value = this.originalJson[key];
                contador = true;
            } else {
                if (idx <= sizeArray - 1) {
                    if (key)
                        value = value[key];
                }
            }
        })
        this.output = value;
    }









    /**
     * Funcion que realiza la peticion para la creacion de variables json endpoint
     * @param metodo 
     * @param url 
     */
    sendQuery(metodo: string, url: HTMLInputElement, object: Object, nombreElement: HTMLInputElement) {
        if (nombreElement.value && url.value) {
            this.clearData();
         
            switch (metodo) {
                case 'GET': {
                    this.vars_service.type_GET(url.value).subscribe((data) => {
                        this.useData(data);
                        this.alertService.setMessageAlert("Peticion realizada correctamente");
                        this.output_show_jsonViewer.emit(true);
                        this.UrlUsed = url.value;
                    }, (err: HttpErrorResponse) => {
                        if (this.alertService)
                            this.alertService.setMessageAlert("Error al realizar la peticion: " + err.message);
                        this.output_show_jsonViewer.emit(false);
                    })
                    break;
                }
                case 'POST': {
                    alert(metodo)
                    if (this.vars_service){
                        this.vars_service.type_POST(url.value, object).subscribe((data) => {
                            this.useData(data);
                            this.alertService.setMessageAlert("Peticion realizada correctamente");
                            this.output_show_jsonViewer.emit(true);
                            this.UrlUsed = url.value;
                        }, (err: HttpErrorResponse) => {
                            if (this.alertService)
                                this.alertService.setMessageAlert("Error al realizar la peticion: " + err.message);
                            this.output_show_jsonViewer.emit(false);
                        })
                    }
                    break;
                }
                case 'PUT': {
                    if (this.vars_service)
                        this.vars_service.type_PUT(url.value, object).subscribe((data) => {
                            this.useData(data);
                            this.alertService.setMessageAlert("Peticion realizada correctamente");
                            this.output_show_jsonViewer.emit(true);
                            this.UrlUsed = url.value;
                        }, (err: HttpErrorResponse) => {
                            if (this.alertService)
                                this.alertService.setMessageAlert("Error al realizar la peticion: " + err.message);
                            this.output_show_jsonViewer.emit(false);
                        })
                    break;
                }
                case 'OPTIONS': {
                    if (this.vars_service)
                        this.vars_service.type_OPTIONS(url.value, object).subscribe((data) => {
                            this.useData(data);
                            this.alertService.setMessageAlert("Peticion realizada correctamente");
                            this.output_show_jsonViewer.emit(true);
                            this.UrlUsed = url.value;
                        }, (err: HttpErrorResponse) => {
                            if (this.alertService)
                                this.alertService.setMessageAlert("Error al realizar la peticion: " + err.message);
                            this.output_show_jsonViewer.emit(false);
                        })
                    break;
                }
                case 'DELETE': {
                    if (this.vars_service)
                        this.vars_service.type_DELETE(url.value, Object).subscribe((data) => {
                            this.useData(data);
                            this.alertService.setMessageAlert("Peticion realizada correctamente");
                            this.output_show_jsonViewer.emit(true);
                            this.UrlUsed = url.value;
                        }, (err: HttpErrorResponse) => {
                            if (this.alertService)
                                this.alertService.setMessageAlert("Error al realizar la peticion: " + err.message);
                            this.output_show_jsonViewer.emit(false);
                        })
                    break;
                }
                case 'PATCH': {
                    if (this.vars_service)
                        this.vars_service.type_PATCH(url.value, object).subscribe((data) => {
                            this.useData(data);
                            this.alertService.setMessageAlert("Peticion realizada correctamente");
                            this.output_show_jsonViewer.emit(true);
                            this.UrlUsed = url.value;
                        }, (err: HttpErrorResponse) => {
                            if (this.alertService)
                                this.output_show_jsonViewer.emit(false);
                            this.alertService.setMessageAlert("Error al realizar la peticion: " + err.message);

                        })
                    break;
                }
                case 'HEAD': {
                    if (this.vars_service)
                        this.vars_service.type_HEAD(url.value, object).subscribe((data) => {
                            this.useData(data);
                            this.alertService.setMessageAlert("Peticion realizada correctamente");
                            this.output_show_jsonViewer.emit(true);
                            this.UrlUsed = url.value;
                        }, (err: HttpErrorResponse) => {
                            if (this.alertService)
                                this.alertService.setMessageAlert("Error al realizar la peticion: " + err.message);

                            this.output_show_jsonViewer.emit(false);
                        })
                    break;
                }
            }
        } else {
            let message = "";
            let showNombreError = false;
            let showUrlError = false;
            if (!nombreElement.value && !url.value) {
                message = "Asigna un nombre y define un endpoint."
                showNombreError = true;
                showUrlError = true;
            } else if (!nombreElement.value) {
                message = "Asigna un nombre a la variable."
                showNombreError = true;
            } else if (!url.value) {
                message = "Define el endpoint de la variable."
                showUrlError = true;
            }

            this.alertService.setMessageAlert(message);

            this.clearData();

            if (showNombreError)
                nombreElement.setAttribute("style", `border: 1px solid red;`);

            if (showUrlError)
                url.setAttribute("style", `border: 1px solid red;`);

            setTimeout(() => {
                if (showNombreError)
                    nombreElement.setAttribute("style", `border: 1px solid black;`);
                if (showUrlError)
                    url.setAttribute("style", `border: 1px solid black;`);
            }, 2000)
        }
    }






    /**
     * Regresa el body que se crea para realizar peticiones en las variables
     * @returns Object
     */
    getObjectJsonEndpointVar(): Object {
        let object = {};
        this.body_query.forEach((item) => {
            if (item.key && item.value) {
                const key: string = item.key;
                const value: string = item.value;
                object = {
                    ...object,
                    [key]: value
                };
            } else {
                if (this.alertService)
                    this.alertService.setMessageAlert("Rellena todos los campos");
            }
        })
        return object;
    }






    /**
    * Funcion que se ejecuta cuando se cambia el metodo de peticion, sirve para mostrar la opcion de datos para json endpoint
    * @param value GET|POST|PUT|OPTIONS|DELETE|PATCH
    */
    private datos: boolean = false;
    changeMethod(value: string) {
        switch (value) {
            case 'GET': {
                this.datos = false;
                break;
            }
            default: {
                this.datos = true;
            }
        }
    }




    /**
     * Funcion para ver o no ver las opciones al crear una variable json
     * @param option 
    */
    parameters_Json_Constructor(option: number) {
        switch (option) {
            case 0: {
                this.output_show_datos.emit(true);
                // this.showDatos = true;
                // this.showSeguridad = false;
                break;
            }
            case 1: {
                this.output_show_seguridad.emit(true);
                // this.showDatos = false;
                // this.showSeguridad = true;
                break;
            }
        }
    }






    /**
     * Funcion para agregar items para los metodos diferentes de Get utilizados en las peticiones
     */
    body_query_addItem() {
        this.body_query.push({ key: '', value: '' });
    }







    /**
    * 
    * @param idx 
    */
    body_query_quitItem(idx: number) {
        this.body_query.splice(idx, 1);
        if (this.body_query.length == 0) {
            this.output_show_datos.emit(false);
            // this.showDatos = false;
        }
    }






    /**
    * 
    * @param value 
    * @param id 
    */
    body_query_changeValue(value: string, id: number) {
        if(this.contieneSoloNumerosYPuntos(value)){
         let number = parseFloat(value);
         this.body_query[id].value = number;
        }else{
            this.body_query[id].value = value;
        }
    }


     contieneSoloNumerosYPuntos(cadena:string) {
        // Utilizamos una expresión regular para verificar si la cadena contiene solo números y puntos
        return /^[0-9.]+$/.test(cadena);
    }



    /**
    * 
    * @param value 
    * @param id 
    */
    body_query_changeKey(value: string, id: number) {
        this.body_query[id].key = value;
    }





    clearData() {
        this.jsonFormatter = [];
        this.keysArr = [];
        this.output = null;
        this.auxKeyArr = [];
        this.idxKeySelected = 0;
        // this.body_query = [];
        this.originalJson = [];
        this.lastLevel = 0;
        this.idxElements = -1;
        this.output_show_jsonViewer.emit(false);
    }

    /************************/
    /*****ENCAPSULACION*****/
    /************************/

    //Regresa el arreglo con el documento json entrante y con los añadidos correspondientes
    get getJsonFormatterArray() {
        return this.jsonFormatter;
    }

    //Regresa un arreglo de llaves padre
    get getkeysArr() {
        return this.keysArr;
    }

    //Regresa el valor del item seleccionado por el usuario
    get getValueJson() {
        return this.output;
    }

    //Regresa el indice del item seleccionado por el usuario
    get getidxKeySelected() {
        return this.idxKeySelected;
    }

    //Regresa el body que se va a usar para las peticiones diferentes a get
    get getBody_Query() {
        return this.body_query;
    }

    //Regresa el token de seguridad que se usa en el endpoint
    get getToken() {
        return this.token;
    }

    //Se asigna el token de seguridad que se usara en el endpoint
    set setToken(token: string) {
        this.token = token;
    }
}