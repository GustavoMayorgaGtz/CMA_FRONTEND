import { Component } from '@angular/core';
import { Add_User_Secundary_Class } from './add-user-secudary-class';

@Component({
  selector: 'app-gestion-cuentas',
  templateUrl: './gestion-cuentas.component.html',
  styleUrls: ['./gestion-cuentas.component.scss']
})
export class GestionCuentasComponent {

  public secundary_user_functions = new Add_User_Secundary_Class();
  constructor(){

  }



  /**
  * Funcion para cambiar el estado de la variable menu que permite regresar, crear o refrescar las vars de la pagina principal
  * @param menu 
  */
  public menu: number = 2;
  changeStatusMenu(menu: number) {
    this.menu = menu;
  }

}
