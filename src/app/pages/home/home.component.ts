import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Add_User_Secundary_Class } from 'src/app/components/cuenta/gestion-cuentas/add-user-secudary-class';
import { Users } from 'src/app/interfaces/GestionUsuarios/GestionUsuarios.Interface';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { SignalService } from 'src/app/service/signal_websocket.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './home.component.mobile.scss']
})

export class HomeComponent {
  constructor(private signalService: SignalService, private router: Router, private authService: AuthService, private alert: AlertService) {
    const idUser = localStorage.getItem("idUser")?localStorage.getItem("idUser"):sessionStorage.getItem("idUser");
    const token = localStorage.getItem("token")?localStorage.getItem("token"):sessionStorage.getItem("token");
    const pwd = localStorage.getItem("pwd");
    
    console.log("VEAMOS SI HAY CREDENCIALES");
    console.log(idUser, token, pwd)
    if (idUser && token) {
      sessionStorage.setItem("idUser", idUser);
      sessionStorage.setItem("token", token)
      this.authService.authUser(parseInt(idUser), token).subscribe((response) => {
        this.token = token;
        this.id_user = parseInt(idUser);

        console.log("Paso antes de fallar:")
        console.log(this.id_user);
        console.log(this.token);
        this.getOneUser(parseInt(idUser));
      }, (err: HttpErrorResponse) => {
        console.log(err);
      })
    } else {
      sessionStorage.removeItem("id_user")
      sessionStorage.removeItem("token")
      this.router.navigate(['/login']);
    }
    const saved_option = localStorage.getItem("menu_number");
    if (saved_option) {
      this.optionEnable = parseInt(saved_option);
    } else {
      this.optionEnable = 3;
    }
  }

  public optionEnable: number = 7;
  /**
   * Funcion para cambiar la vista del menu
   */
  setOptionEnable(opcion: number) {
    localStorage.setItem("menu_number", opcion.toString())
    this.optionEnable = opcion;
  }


  private token!: string;
  public id_user!: number;
  public secundary_user_functions = new Add_User_Secundary_Class(this.authService, this.alert);
  public userSelected!: Users | null;
  /**
   * @description funcion para obtener un usuario por su id de usuario
   * @param find_id_user 
   */
  getOneUser(find_id_user: number) {
    if (this.token && this.id_user) {
      this.authService.getOneUser(this.id_user, find_id_user, this.token).subscribe((user) => {
        this.alert.setMessageAlert("Usuarios cargado");
        const functionsacces = user[0].access_functions.replaceAll(/[()]/g, "").split(",").map((v) => v == 't' ? true : false);
        const access_functions_this = {
          modify_position_tools: functionsacces[0],
          edit_tools: functionsacces[1],
          create_tools: functionsacces[2],
          alerts: functionsacces[3],
          watch_variables: functionsacces[4]
        }
        const userTransform: Users = { ...user[0], access_functions: access_functions_this }
        this.userSelected = userTransform;

        //Estableciendo los valores de actualizacion
        this.secundary_user_functions.input_correo = userTransform.correo;
        this.secundary_user_functions.input_nombre_usuario = userTransform.nombre_usuario;
        this.secundary_user_functions.input_telefono = userTransform.telefono;
        this.secundary_user_functions.set_all_params = access_functions_this;

      }, (err: HttpErrorResponse) => {
        this.alert.setMessageAlert("No se ha podido recuperar los usuarios")
      })
    }
  }
}
