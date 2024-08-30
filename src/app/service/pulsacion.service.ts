import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from 'src/environments/environment';
import { IConfigurationShadow } from '../interfaces/TieldmapInterfaces/tieldmapinterfaces';
import { ICreate_Pulsacion, IPulsacion_Recive } from '../interfaces/PulsacionInterfaces/pulsacion.interfaces';
@Injectable({
  providedIn: 'root'
})
export class PulsacionService {

  constructor(private http: HttpClient) { }


  create_pulsacion(payload: ICreate_Pulsacion) {
    return this.http.post<String>(server + "pulse/create", payload);
  }


  getAll_Dashboard(token: string, id_user: number, id_dashboard: number) {
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IPulsacion_Recive[]>(server + `pulse/getAll_Dashboard?id_user=${id_user}&id_dashboard=${id_dashboard}`, {headers});
  }
  
  getAll(token: string, id_user: number) {
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IPulsacion_Recive[]>(server + `pulse/getAll?id_user=${id_user}`, {headers});
  }

  getOne(primary_user: number, id_pulsacion: number){
    return this.http.get<IPulsacion_Recive>(server + `pulse/getOne?primary_user=${primary_user}&id_pulsacion=${id_pulsacion}`);
  }

  updatePositionAndSizeIndicators(params: IConfigurationShadow){
    return this.http.post(server+"pulse/positions", params);
  }

}
