import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from 'src/environments/environment';
import { IConfigurationShadow } from '../interfaces/TieldmapInterfaces/tieldmapinterfaces';
import { ICamera_Recive, ICreate_Camera } from '../interfaces/CameraInterfaces/camera.interfaces';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private http: HttpClient,
    private router: Router
  ) { }


  create_camera(payload: ICreate_Camera) {
    const token = sessionStorage.getItem("token")
    if (!token) {
      this.router.navigate(['/login'])
    }
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<String>(server + "camera/create", payload, {headers});
  }


  getAll_Dashboard(token: string, id_user: number, id_dashboard: number) {
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ICamera_Recive[]>(server + `camera/getAll_Dashboard?id_user=${id_user}&id_dashboard=${id_dashboard}`, { headers });
  }

  getAll(token: string, id_user: number) {
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ICamera_Recive[]>(server + `camera/getAll?id_user=${id_user}`, { headers });
  }

  getOne(primary_user: number, id_indicator: number) {
    const token = sessionStorage.getItem("token")
    if (!token) {
      this.router.navigate(['/login'])
    }
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ICamera_Recive>(server + `camera/getOne?primary_user=${primary_user}&id_indicator=${id_indicator}`, {headers});
  }

  updatePositionAndSizeIndicators(params: IConfigurationShadow) {
    return this.http.post(server + "camera/positions", params);
  }

}
