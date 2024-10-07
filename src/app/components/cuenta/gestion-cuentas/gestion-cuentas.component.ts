import { Component } from '@angular/core';
import { Add_User_Secundary_Class } from './add-user-secudary-class';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { AlertService } from 'src/app/service/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { access_functions, Users } from 'src/app/interfaces/GestionUsuarios/GestionUsuarios.Interface';

@Component({
  selector: 'app-gestion-cuentas',
  templateUrl: './gestion-cuentas.component.html',
  styleUrls: ['./gestion-cuentas.component.scss']
})
export class GestionCuentasComponent {

  public secundary_user_functions = new Add_User_Secundary_Class(this.authService, this.alert);
  private token!: string;
  private id_user!: number;
  constructor(private router: Router, private authService: AuthService, private alert: AlertService) {
    const token = sessionStorage.getItem("token");
    const id_user = sessionStorage.getItem("idUser");
    if (token && id_user) {
      this.token = token;
      this.id_user = parseInt(id_user);
      this.getUsers();
    } else {
      sessionStorage.removeItem("id_user")
      sessionStorage.removeItem("token")
      this.router.navigate(['/login']);
    }
  }

  public users: Users[] = [];
  getUsers() {
    if (this.token && this.id_user) {
      this.authService.getUsers(this.id_user, this.token).subscribe((users) => {
        this.alert.setMessageAlert("Usuarios cargados...");
        this.users = [];
        users.forEach(user => {
         
          const functionsacces = user.access_functions.replaceAll(/[()]/g, "").split(",").map((v) => v == 't'? true:false);
          const access_functions_this: access_functions = {
            edit_json_connection: functionsacces[0],
            drop_json_connection: functionsacces[1],
            modify_json_connection: functionsacces[2],
            use_json_connection: functionsacces[3],
            edit_modbus_connection: functionsacces[4],
            drop_modbus_connection: functionsacces[5],
            modify_modbus_connection: functionsacces[6],
            use_modbus_connection: functionsacces[7],
            edit_memory_connection: functionsacces[8],
            drop_memory_connection: functionsacces[9],
            modify_memory_connection: functionsacces[10],
            use_memory_connection: functionsacces[11],
            edit_endpoint_connection: functionsacces[12],
            drop_endpoint_connection: functionsacces[13],
            modify_endpoint_connection: functionsacces[14],
            use_endpoint_connection: functionsacces[15],
            create_line_graph: functionsacces[16],
            drop_line_graph: functionsacces[17],
            edit_line_graph: functionsacces[18],
            modify_line_graph: functionsacces[19],
            create_simple_button: functionsacces[20],
            drop_simple_button: functionsacces[21],
            edit_simple_button: functionsacces[22],
            modify_simple_button: functionsacces[23],
            create_alert_sms: functionsacces[24],
            edit_alert_sms: functionsacces[25],
            drop_alert_sms: functionsacces[26],
            view_alert_sms_logs: functionsacces[27],
            modify_tieldmap: functionsacces[28]
          }
        
          const userTransform: Users = {...user, access_functions:access_functions_this }
          this.users.push(userTransform);
        })
       
      }, (err: HttpErrorResponse) => {
         this.alert.setMessageAlert("No se ha podido recuperar los usuarios")
      })
    }
  }



  public userSelected!: Users;
  getOneUser(find_id_user: number){
    if (this.token && this.id_user) {
      this.authService.getOneUser(this.id_user, find_id_user, this.token).subscribe((user) => {
        this.alert.setMessageAlert("Usuarios cargado");
        console.log("usuario seleccionado")
        console.log(user[0].access_functions)
        console.log(user[0].access_functions.replaceAll(/[()]/g, ""))
        const functionsacces = user[0].access_functions.replaceAll(/[()]/g, "").split(",").map((v) => v == 't'? true:false);
        console.log("Size: ", functionsacces.length)
        console.log(functionsacces)
        const access_functions_this = {
          edit_json_connection: functionsacces[0],
          drop_json_connection: functionsacces[1],
          modify_json_connection: functionsacces[2],
          use_json_connection: functionsacces[3],
          edit_modbus_connection: functionsacces[4],
          drop_modbus_connection: functionsacces[5],
          modify_modbus_connection: functionsacces[6],
          use_modbus_connection: functionsacces[7],
          edit_memory_connection: functionsacces[8],
          drop_memory_connection: functionsacces[9],
          modify_memory_connection: functionsacces[10],
          use_memory_connection: functionsacces[11],
          edit_endpoint_connection: functionsacces[12],
          drop_endpoint_connection: functionsacces[13],
          modify_endpoint_connection: functionsacces[14],
          use_endpoint_connection: functionsacces[15],
          create_line_graph: functionsacces[16],
          drop_line_graph: functionsacces[17],
          edit_line_graph: functionsacces[18],
          modify_line_graph: functionsacces[19],
          create_simple_button: functionsacces[20],
          drop_simple_button: functionsacces[21],
          edit_simple_button: functionsacces[22],
          modify_simple_button: functionsacces[23],
          create_alert_sms: functionsacces[24],
          edit_alert_sms: functionsacces[25],
          drop_alert_sms: functionsacces[26],
          view_alert_sms_logs: functionsacces[27],
          modify_tieldmap: functionsacces[28]
        }
        console.log(access_functions_this)
      
        const userTransform: Users = {...user[0], access_functions:access_functions_this }
        this.userSelected = userTransform;
        
        this.menu = 2;
      }, (err: HttpErrorResponse) => {
         this.alert.setMessageAlert("No se ha podido recuperar los usuarios")
      })
    }
  }


  /**
  * Funcion para cambiar el estado de la variable menu que permite regresar, crear o refrescar las vars de la pagina principal
  * @param menu 
  */
  public menu: number = 1;
  changeStatusMenu(menu: number) {
    this.menu = menu;
  }


  saveUser() {
    this.secundary_user_functions.add_user(this.id_user, this.token)
      .then((response) => {
        if (response) {
          this.menu = 1;
        } else {

        }
      })
      .catch((err) => {
        this.menu = 1;
      })
  }

}
