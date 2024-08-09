import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
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


  getAll(primary_user: number){
    return this.http.get<IRecive_Indicator[]>(server + "indicators/getAll?primary_user="+primary_user);
  }

  getOne(primary_user: number, id_indicator: number){
    return this.http.get<IRecive_Indicator>(server + `indicators/getOne?primary_user=${primary_user}&id_indicator=${id_indicator}`);
  }

  updatePositionAndSizeIndicators(params: IConfigurationShadow){
    return this.http.post(server+"indicators/positions", params);
  }

}
