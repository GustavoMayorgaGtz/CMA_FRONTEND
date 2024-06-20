import { HttpErrorResponse } from "@angular/common/http";
import { EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { IUser } from "../interfaces/LoginInterface/login.interface";

export let userEvent = new EventEmitter<IUser>();

export class functions {
    constructor(private services: ServiciosService, private alertService: AlertboxService, private router: Router) {
    }

    /**
     * Funcion donde se maneja la verificacion de cuentas de usuario para acceder a funciones del sistema
     */
    verifyAccount() {
        let idUser = sessionStorage.getItem("iduser");
        const token = sessionStorage.getItem("token");
        if (idUser && token) {
            const idUserParser = parseInt(idUser);
            this.services.verifyAccount({ idUser: idUserParser, token }).subscribe((info) => {
                if (!info) {
                    this.loginRedirect();
                } else {
                    //Usuario logeado y verificado
                    if (idUser) {
                        let id = parseInt(idUser);
                        this.services.getUserById(id, token).subscribe((user) => {
                            userEvent.emit(user);
                        }, (err: HttpErrorResponse) => {
                            //Esta situacion no deberia pasar 
                            console.log("Error al obtener usuario by id In functions class")
                            this.loginRedirect();
                        })
                    } else {
                        //Esta situacion no deberia pasar 
                        console.log("Error al obtener el idUser In functions class")
                        this.loginRedirect();
                    }
                }
            }, (err: HttpErrorResponse) => {
                console.log("Error al verificar usuario In functions class")
                this.loginRedirect();
            })
        } else {
            console.log("No se cuenta con un credenciales existentes In functions class")
            this.loginRedirect();
        }
    }

    private loginRedirect() {
        sessionStorage.clear()
        //No cumple con todos los requisitos
        if (this.alertService) {
            this.alertService.sendAlertBad("Sesion expirada");
            this.router?.navigate(["login"]);
        }
    }
}


export function getIniciales(idUser: number) {
    switch (idUser) {
        case 2: {
            return "GP"
            break;
        }
        case 3: {
            return "LB"
            break;
        }
        case 4: {
            return "JC"
            break;
        }
        case 5: {
            return "MC"
            break;
        }
        case 6: {
            return "RM"
            break;
        }
        case 7: {
            return "EB"
            break;
        }
        case 8: {
            return "JS"
            break;
        }
        case 11: {
            return "EH"
            break;
        }
        default :{
            return "AD"
        }
    }
}

