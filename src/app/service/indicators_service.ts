import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from 'src/environments/environment';
import { ICreate_Indicator, IRecive_Indicator } from '../interfaces/IndicatorInterfaces/indicator_interfaces';
import { IConfigurationShadow } from '../interfaces/TieldmapInterfaces/tieldmapinterfaces';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  constructor(private http: HttpClient) { }


  create_indicator(payload: ICreate_Indicator) {
    return this.http.post<String>(server + "indicators/create", payload);
  }


  getAll(token: string, id_user: number, id_dashboard: number) {
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IRecive_Indicator[]>(server + `indicators/getAll?id_user=${id_user}&id_dashboard=${id_dashboard}`, {headers});
  }

  getOne(primary_user: number, id_indicator: number){
    return this.http.get<IRecive_Indicator>(server + `indicators/getOne?primary_user=${primary_user}&id_indicator=${id_indicator}`);
  }

  updatePositionAndSizeIndicators(params: IConfigurationShadow){
    return this.http.post(server+"indicators/positions", params);
  }

}
