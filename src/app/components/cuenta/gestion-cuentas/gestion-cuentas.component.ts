import { Component } from '@angular/core';
import { Add_User_Secundary_Class } from './add-user-secudary-class';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { AlertService } from 'src/app/service/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { access_functions, Users } from 'src/app/interfaces/GestionUsuarios/GestionUsuarios.Interface';
import { count } from 'rxjs';
import { ZonaHorariaService } from 'src/app/service/zona-horaria.service';
import { Zona_Horaria } from 'src/app/interfaces/Zona_Horaria/zona_horaria.interface';

@Component({
  selector: 'app-gestion-cuentas',
  templateUrl: './gestion-cuentas.component.html',
  styleUrls: ['./gestion-cuentas.component.scss']
})
export class GestionCuentasComponent {

  public secundary_user_functions = new Add_User_Secundary_Class(this.authService, this.alert);
  private token!: string;
  public id_user!: number;
  public users: Users[] = [];
  public userSelected!: Users | null;
  public menu: number = 1;



  constructor(private router: Router, private authService: AuthService, private alert: AlertService, private zona_horaria_service: ZonaHorariaService) {
    const token = sessionStorage.getItem("token");
    const id_user = sessionStorage.getItem("idUser");
    if (token && id_user) {
      this.token = token;
      this.id_user = parseInt(id_user);
      this.getUsers();
      this.get_zona_horaria();
    } else {
      sessionStorage.removeItem("id_user")
      sessionStorage.removeItem("token")
      this.router.navigate(['/login']);
    }
  }

  public zonas_horarias: Zona_Horaria[] = [];
  get_zona_horaria() {
    this.zona_horaria_service.getZonaHoraria().subscribe((response) => {
      this.zonas_horarias = response;
    })
  }
  /**
   * Obtener todos los usuarios by id_usuario_primario
   */
  getUsers(showAlert?: boolean) {
    if (this.token && this.id_user) {
      this.authService.getUsers(this.id_user, this.token).subscribe((users) => {
        if(!showAlert)
        this.alert.setMessageAlert("Usuarios cargados...");
        this.users = [];
        if (users) {
          users.forEach(user => {
            console.log("___________________")
            console.log(user.access_functions);
            const functionsacces = user.access_functions.replaceAll(/[()]/g, "").split(",").map((v) => v == 't' ? true : false);
            const access_functions_this: access_functions = {
              modify_position_tools: functionsacces[0],
              edit_tools: functionsacces[1],
              create_tools: functionsacces[2],
              alerts: functionsacces[3],
              watch_variables: functionsacces[4]
            }

            const userTransform: Users = { ...user, access_functions: access_functions_this }
            this.users.push(userTransform);
          })
        }


      }, (err: HttpErrorResponse) => {
        this.alert.setMessageAlert("No se ha podido recuperar los usuarios")
      })
    }
  }


  enabledPasswordChange(input: HTMLInputElement){
    input.disabled = false
  }

  changeEnableduser(modify_id_user: number, status: boolean) {
    this.authService.changeEnableduser(modify_id_user, status).subscribe((payload) => {
      this.alert.setMessageAlert("Estado de usuario cambiado.");
      this.getUsers(true);
      console.log("respuesta de cambio: ", payload)
    }, (err: HttpErrorResponse) => {
      this.alert.setMessageAlert("Error al cambiar el estado del usuario.");
      console.log("Error de respuesta: ", err.message)
    })
  }


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
        this.secundary_user_functions.input_zona_horaria = userTransform.zona_horaria;
        this.secundary_user_functions.input_telefono = userTransform.telefono;
        this.secundary_user_functions.set_all_params = access_functions_this;

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
  changeStatusMenu(menu: number) {
    if (menu == 1) {
      this.getUsers();
      this.userSelected = null;
    }
    this.menu = menu;
  }



  /**
   * Creacion de un usuario nuevo
   */
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



  /**
   * Actualizacion de un usuario
   */
  updateUser() {
    if (this.userSelected)
      this.secundary_user_functions.update_user(this.userSelected?.id_usuario, this.id_user, this.token)
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

  public search_user_value: string = "";
  searchUser(search_user: string) {
    this.search_user_value = search_user;
  }


  getPermissionsCount(user: Users): number {
    let counter = 0;
    Object.keys(user.access_functions).forEach((key) => {
      const access = user.access_functions[key as keyof typeof user.access_functions];
      if (access) {
        counter++;
      }
    });
    return counter;
  }

}
