import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { access_functions, Users } from 'src/app/interfaces/GestionUsuarios/GestionUsuarios.Interface';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { Add_User_Secundary_Class } from '../gestion-cuentas/add-user-secudary-class';
import { ZonaHorariaService } from 'src/app/service/zona-horaria.service';
import { Zona_Horaria } from 'src/app/interfaces/Zona_Horaria/zona_horaria.interface';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.scss', './mi-cuenta.component.mobile.scss']
})
export class MiCuentaComponent {

  public menu: number = 1;
  private token!: string;
  public id_user!: number;

  constructor(private router: Router, private authService: AuthService, private alert: AlertService, private zona_horaria_service: ZonaHorariaService) {
    const token = sessionStorage.getItem("token");
    const id_user = sessionStorage.getItem("idUser");
    if (token && id_user) {
      this.get_zona_horaria();
      this.authService.authUser(parseInt(id_user), token).subscribe((response) => {
        this.token = token;
        this.id_user = parseInt(id_user);
        this.getOneUser(parseInt(id_user));
      }, (err: HttpErrorResponse) => {
        console.log(err);
      })
    } else {
      sessionStorage.removeItem("id_user")
      sessionStorage.removeItem("token")
      this.router.navigate(['/login']);
    }
  }


  change_zona_horaria(zona_horaria: string) {
    if (zona_horaria != this.userSelected?.zona_horaria) {
       this.zona_horaria_service.updateZonaHoraria(zona_horaria).subscribe((response) => {
        this.alert.setMessageAlert("Se actualizo el usuario");
       }, (err) => {
        this.alert.setMessageAlert("No se actualizo el usuario");
       })
    }
  }


  public zonas_horarias: Zona_Horaria[] = [];
  get_zona_horaria() {
    this.zona_horaria_service.getZonaHoraria().subscribe((response) => {
      this.zonas_horarias = response;
    })
  }


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

        this.menu = 2;
      }, (err: HttpErrorResponse) => {
        this.alert.setMessageAlert("No se ha podido recuperar los usuarios")
      })
    }
  }
}
