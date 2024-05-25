import { Output } from "@angular/core";
import { access_functions } from "src/app/interfaces/GestionUsuarios/GestionUsuarios.Interface";

export class Add_User_Secundary_Class {

  // @Output()

  contructor() {
  }

  add_user(){
    // if()
  }

  /*________________ENTRADA DE DATOS________________*/

  //Entrada para el nombre_usuario
  private nombre_usuario = "";
  set input_nombre_usuario(nombre_usuario: string) {
    this.nombre_usuario = nombre_usuario;
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
    edit_json_connection: false,
    drop_json_connection: false,
    modify_json_connection: false,
    use_json_connection: false,
    edit_modbus_connection: false,
    drop_modbus_connection: false,
    modify_modbus_connection: false,
    use_modbus_connection: false,
    edit_memory_connection: false,
    drop_memory_connection: false,
    modify_memory_connection: false,
    use_memory_connection: false,
    edit_endpoint_connection: false,
    drop_endpoint_connection: false,
    modify_endpoint_connection: false,
    use_endpoint_connection: false,
    create_line_graph: false,
    drop_line_graph: false,
    edit_line_graph: false,
    modify_line_graph: false,
    create_simple_button: false,
    drop_simple_button: false,
    edit_simple_button: false,
    modify_simple_button: false,
    create_alert_sms: false,
    edit_alert_sms: false,
    drop_alert_sms: false,
    view_alert_sms_logs: false,
    modify_tieldmap: false
  }



  //# PERMISOS DE VARIABLES

  //Entrada para editar las variables json
  set input_crear_variable_json(status: boolean) {
    this.access_functions.edit_json_connection = status;
  }

  //Entrada para editar las variables modbus
  set input_crear_variable_modbus(status: boolean) {
    this.access_functions.edit_modbus_connection = status;
  }

  //Entrada para editar las variables memory
  set input_crear_variable_memory(status: boolean) {
    this.access_functions.edit_memory_connection = status;
  }

  //Entrada para editar las variables cma endpoint
  set input_crear_variable_endpoint(status: boolean) {
    this.access_functions.edit_endpoint_connection = status;
  }

  //Entrada para eliminar las variables json
  set input_eliminar_variable_json(status: boolean) {
    this.access_functions.drop_json_connection = status;
  }

  //Entrada para eliminar las variables modbus
  set input_eliminar_variable_modbus(status: boolean) {
    this.access_functions.drop_modbus_connection = status;
  }

  //Entrada para eliminar las variables memory
  set input_eliminar_variable_memory(status: boolean) {
    this.access_functions.drop_memory_connection = status;
  }

  //Entrada para eliminar las variables cma endpoint
  set input_eliminar_variable_endpoint(status: boolean) {
    this.access_functions.drop_endpoint_connection = status;
  }






  //# PERMISOS DE DASHBOARD
  //Entrada para modificar el dashboard
  set input_modify_tieldmap(status: boolean) {
    this.access_functions.modify_tieldmap = status;
  }

  //Entrada para crear graficos lineales
  set input_crear_line_graph(status: boolean) {
    this.access_functions.create_line_graph = status;
  }

  //Entrada para crear botones simples
  set input_crear_simple_button(status: boolean) {
    this.access_functions.create_simple_button = status;
  }







  //# PERMISOS DE ALERTAS

  //Entrada para ver los eventos de una alerta sms
  set input_logs_alertas_sms(status: boolean)
  {
    this.access_functions.view_alert_sms_logs = status;
  }

  //Entrada para crear alertas sms
  set input_crear_alertas_sms(status: boolean)
  {
    this.access_functions.create_alert_sms = status;
  }

}
