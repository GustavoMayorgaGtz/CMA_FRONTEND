import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { server } from 'src/environments/environment';
import { IAlertSMS_Create, IAlertSMS_Database } from '../interfaces/AlertSMS/AlertSMS';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Alert_SMS_Service {
  constructor(private http: HttpClient, private router: Router) { }

  create(body: IAlertSMS_Create) {
    const token = sessionStorage.getItem("token");
    if (!token) {
      this.router.navigate(['/login']);
    }
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(server + "alert/create", body, {headers});
  }

  getAllAlertSMS(idUser: number) {
    const token = sessionStorage.getItem("token");
    if (!token) {
      this.router.navigate(['/login']);
    }
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<IAlertSMS_Database[]>(server + "alert/getAll?idUser=" + idUser, {headers});
  }
}
