import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss', './cuenta.component.mobile.scss']
})
export class CuentaComponent {
  public menuCuenta: number = 1; //1 = mi cuenta, 2 = gestion de cuentas, 3 = accesos api




  public rango = "SECUNDARY";
  constructor(private router: Router, private authService: AuthService, private alert: AlertService) {
    const token = sessionStorage.getItem("token");
    const id_user = sessionStorage.getItem("idUser");
    if (token && id_user) {
      this.authService.getOneUser(parseInt(id_user), parseInt(id_user), token).subscribe((user) => {
        console.log("Investigando a este usuario")
        this.rango = user[0].role;
      })
    }
  }





  changeMenuCuenta(option: number) {
    this.menuCuenta = option;
  }
}
