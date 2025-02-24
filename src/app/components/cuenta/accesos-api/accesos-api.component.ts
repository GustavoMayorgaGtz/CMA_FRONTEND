import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ISuscription } from 'src/app/interfaces/Suscription/suscription.interfaces';
import { SuscriptionServices } from 'src/app/service/suscription.services';



@Component({
  selector: 'app-accesos-api',
  templateUrl: './accesos-api.component.html',
  styleUrls: ['./accesos-api.component.scss']
})
export class AccesosApiComponent {

  public suscripcion: ISuscription = {
    enabled: true,
    suscription_id: "CMA BASIC ALERTS",
    active_in: "20 de Febrero del 2025",
    expire_in: "20 de Marzo del 2025",
    tools_capacity: 3,
    tools_used: 0,
    camara_capacity: 2, 
    camara_used: 0,
    alerts_enabled: true,
    alerts_number_dedicated: true,
    historical_data: 500,
    manageable_users: 2,
    manageable_users_used: 0,
    access_api: true
  }

  constructor(private suscriptionService: SuscriptionServices){
    this.suscriptionService.getCustomer().subscribe((response) => {
      console.log(response);
      this.suscripcion = response;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })
  }


}
