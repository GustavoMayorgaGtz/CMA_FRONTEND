import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { server } from 'src/environments/environment';
import { IDashboardGet } from '../interfaces/DasboardInterface/dashboard.interface';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  /**
   * @description Servicio para obtener los dashboard del usuario
   * @param primary_user 
   * @param token 
   * @returns 
   */
  getDashboardsUser(primary_user: number, token: string){
      // Agrega el token Bearer al encabezado de la solicitud
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.post<IDashboardGet[]>(server+"dashboard/getDashboardsUser", {primary_user}, {headers})
  }

  
}