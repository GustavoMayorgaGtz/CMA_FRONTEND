import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from 'src/environments/environment';
import { ICreate_Indicator, IRecive_Indicator } from '../interfaces/IndicatorInterfaces/indicator_interfaces';
import { IConfigurationShadow } from '../interfaces/TieldmapInterfaces/tieldmapinterfaces';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  constructor(private http: HttpClient, private router: Router) { }


  create_indicator(payload: ICreate_Indicator) {
    const token = sessionStorage.getItem("token");
    if (!token) {
      this.router.navigate(['/login']);
    }
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<String>(server + "indicators/create", payload, { headers });
  }


  getAll_Dashboard(token: string, id_user: number, id_dashboard: number) {
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IRecive_Indicator[]>(server + `indicators/getAll_Dashboard?id_user=${id_user}&id_dashboard=${id_dashboard}`, { headers });
  }

  getAll(token: string, id_user: number) {
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IRecive_Indicator[]>(server + `indicators/getAll?id_user=${id_user}`, { headers });
  }

  getOne(primary_user: number, id_indicator: number): Observable<IRecive_Indicator> {
    const token = sessionStorage.getItem("token");
    if (!token) {
      this.router.navigate(['/login']);
    }
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<IRecive_Indicator>(server + `indicators/getOne?primary_user=${primary_user}&id_indicator=${id_indicator}`, { headers });
  }

  updatePositionAndSizeIndicators(params: IConfigurationShadow) {
    return this.http.post(server + "indicators/positions", params);
  }

}
