import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { server } from 'src/environments/environment';
import { ICreate_Indicator } from '../interfaces/IndicatorInterfaces/indicator_interfaces';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  constructor(private http: HttpClient) { }


  create_indicator(payload: ICreate_Indicator) {
    return this.http.post<String>(server + "indicators/create", payload);
  }



}
