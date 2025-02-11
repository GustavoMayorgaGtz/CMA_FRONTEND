import { HttpErrorResponse } from "@angular/common/http";
import { Output } from "@angular/core";
import { access_functions } from "src/app/interfaces/GestionUsuarios/GestionUsuarios.Interface";
import { AlertService } from "src/app/service/alert.service";
import { AuthService } from "src/app/service/auth.service";

export class Add_User_Secundary_Class {

  // @Output()

  constructor(private authService: AuthService,
    private alert: AlertService
  ) {
  }

  /**
   * @description Funcion para añadir un usuario al usuario secundario
   * @param primaryUser Usuario que va a crear
   * @param token token de acceso del usuario que va a crear
   * @returns 
   */
  add_user(primaryUser: number, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (primaryUser && token && regex.test(this.correo)){
        this.authService.registerSecondaryUser(this.nombre_usuario, this.zona_horaria,
          this.correo, this.password, this.telefono, primaryUser, this.access_functions, token)
          .subscribe((response) => {
            this.alert.setMessageAlert("Usuario creado");
            resolve(true)
          }, (err: HttpErrorResponse) => {
            console.log(err.error);
            switch (err.error.status) {
              case 1: {
                this.alert.setMessageAlert(err.error.message);
                break;
              }
              case 2: {
                this.alert.setMessageAlert("Usuario no creado por error desconocido");
                break;
              }
            }

            reject(false);
          })
      } else {
        this.alert.setMessageAlert("Define correctamente el correo.")
        resolve(false);
      }
    })
  }


  /**
 * @description Funcion para añadir un usuario al usuario secundario
 * @param primaryUser Usuario que se va a actualizar
 * @param primaryUser Usuario que va a crear
 * @param token token de acceso del usuario que va a crear
 * @returns 
 */
  update_user(id_user_selected: number, primaryUser: number, token: string) {
    return new Promise((resolve, reject) => {
      if (primaryUser && token && this.correo.includes("@")) {
        this.authService.updateUser(this.nombre_usuario, this.zona_horaria,
          this.correo, this.password, this.telefono, primaryUser, id_user_selected, this.access_functions, token)
          .subscribe((response) => {
            this.alert.setMessageAlert("Usuario actualizado");
            resolve(true)
          }, (err: HttpErrorResponse) => {
            console.log(err.error);
            switch (err.error.status) {
              case 1: {
                this.alert.setMessageAlert(err.error.message);
                break;
              }
              case 2: {
                break;
              }
            }
            reject(false);
          })
      } else {
        this.alert.setMessageAlert("Define correctamente el correo.")
        resolve(false);
      }
    })
  }

  /*________________ENTRADA DE DATOS________________*/

  //Entrada para el nombre_usuario
  private nombre_usuario = "";
  set input_nombre_usuario(nombre_usuario: string) {
    this.nombre_usuario = nombre_usuario;
  }

  //Entrada para la zona horaria
  private zona_horaria = "";
  set input_zona_horaria(zona_horaria: string) {
    this.zona_horaria = zona_horaria;
  }

  //Entrada para el correo
  private correo = "";
  set input_correo(correo: string) {
    this.correo = correo;
  }

  //Entrada para el password
  private password = "";
  set input_password(password: string) {
    this.password = password;
  }

  //Entrada para el telefono
  private telefono = "";
  set input_telefono(telefono: string) {
    this.telefono = telefono;
  }

  //Entrada para access_functions
  private access_functions: access_functions = {
    modify_position_tools: false,
    edit_tools: false,
    create_tools: false,
    alerts: false,
    watch_variables: false
  }



  //# PERMISOS DE VARIABLES

  set set_all_params(params: access_functions) {
    this.access_functions = params;
  }

  //Editar posiciones y tamaños de las herramientas
  set set_modify_position_tools(status: boolean) {
    this.access_functions.modify_position_tools = status;
  }
  //Editar posiciones y tamaños de las herramientas
  set set_edit_tools(status: boolean) {
    this.access_functions.edit_tools = status;
  }
  //Editar posiciones y tamaños de las herramientas
  set set_create_tools(status: boolean) {
    this.access_functions.create_tools = status;
  }
  //Editar posiciones y tamaños de las herramientas
  set set_alerts(status: boolean) {
    this.access_functions.alerts = status;
  }
  //Editar posiciones y tamaños de las herramientas
  set set_watch_variables(status: boolean) {
    this.access_functions.watch_variables = status;
  }
}
