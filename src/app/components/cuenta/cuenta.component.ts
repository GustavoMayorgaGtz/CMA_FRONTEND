import { Component } from '@angular/core';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss']
})
export class CuentaComponent {
  public menuCuenta: number = 2; //1 = mi cuenta, 2 = gestion de cuentas, 3 = accesos api
}
