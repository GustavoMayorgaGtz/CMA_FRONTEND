import { HttpErrorResponse } from "@angular/common/http";
import { AlertService } from "../service/alert.service";
import { VarsService } from "../service/vars";
import { EventEmitter } from "@angular/core";

export class ModbusVariableClass {

    //OUTPUT MODBUS
    public output_modbus_variableCreada: EventEmitter<boolean> = new EventEmitter();
    public output_modbus_borrar: EventEmitter<boolean> = new EventEmitter();
    public output_modbus_get_value: EventEmitter<any> = new EventEmitter();

    constructor(private varsService: VarsService
        , private alertService: AlertService) {
    }

    /**
   * Funcion para testear la conexion de la variable antes de crearla
   * @param ip String
   * @param port number
   * @param no_register number
   *
   */
    testConnection(
        ip: string,
        port: string,
        no_register: string,
        quantity: string,
        type_date: string,
        unidId: string
    ) {
        const no_ip = ip.split(".");
        let noOfPoints = ((ip.split(".").length) == 4) ? true : false;
        no_ip.forEach((key) => {
            if (key.length > 3)
                noOfPoints = false;
        });
        if (noOfPoints) {
            if (ip && port && no_register) {
                this.varsService.test_Modbus_var({ ip, port, no_register, quantity, type_date, unidId }).subscribe((data) => {
                    this.alertService.setMessageAlert("Parametros correctos");
                    this.output_modbus_get_value.emit(data);
                }, (err: HttpErrorResponse) => {
                    if (err.status == 409) {
                        this.alertService.setMessageAlert("El nombre de esta variable ya esta en uso, Define otro");
                    } else if(err.status == 400) {
                        const message_error = err.error.message;
                        this.alertService.setMessageAlert(message_error);
                    }else{
                        this.alertService.setMessageAlert("Error al crear la variable modbus.  Err: " + err.message);
                    }
                })
            } else {
                (!ip) ? this.alertService.setMessageAlert("Define la ip del PLC") : "";
                (!port) ? this.alertService.setMessageAlert("Define el puerto del PLC") : "";
                (!no_register) ? this.alertService.setMessageAlert("Define el numero de registro") : "";
            }
        } else {
            this.alertService.setMessageAlert("La ip del PLC no esta declarada correctamente");
        }
    }

    /**
     * Funcion para registrar una variable modbus
     * @param nombre String
     * @param ip String
     * @param port number
     * @param no_register number
     *
     */
    createVariable(nombre: string,
        ip: string,
        port: string,
        no_register: string,
        quantity: string,
        type_date: string,
        unidId: string) {
        const no_ip = ip.split(".");
        let noOfPoints = ((ip.split(".").length) == 4) ? true : false;
        no_ip.forEach((key) => {
            if (key.length > 3)
                noOfPoints = false;
        });
        if (noOfPoints) {
            if (nombre &&
                ip &&
                port &&
                no_register &&
                quantity &&
                type_date &&
                unidId) {
                if (confirm("¿Deseas guardar la variable modbus?")) {
                    this.varsService.create_Modbus_var({ 
                        name: nombre,
                        ip,
                        port,
                        no_register,
                        quantity,
                        type_date,
                        unidId}).subscribe((data) => {
                        this.alertService.setMessageAlert("Variable modbus creada");
                        this.output_modbus_variableCreada.emit(true);
                    }, (err: HttpErrorResponse) => {
                        if (err.status == 409) {
                            this.alertService.setMessageAlert("El nombre de esta variable ya esta en uso, Define otro");
                        } else {
                            this.alertService.setMessageAlert("Error al crear la variable modbus.  Err: " + err.message);
                        }
                    })
                } else {
                    this.alertService.setMessageAlert("No se ha creado la variable modbus");
                }
            } else {
                (!nombre) ? this.alertService.setMessageAlert("Define el nombre de la variable") : "";
                (!ip) ? this.alertService.setMessageAlert("Define la ip del PLC") : "";
                (!port) ? this.alertService.setMessageAlert("Define el puerto del PLC") : "";
                (!no_register) ? this.alertService.setMessageAlert("Define el numero de registro") : "";
            }
        } else {
            this.alertService.setMessageAlert("La ip del PLC no esta declarada correctamente");
        }

    }
}