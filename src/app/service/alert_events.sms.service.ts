import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { server } from 'src/environments/environment';
import { Router } from '@angular/router';
import { IAlertSMS_Event } from '../interfaces/AlertEventSMS/AlertEventSMS';

@Injectable({
  providedIn: 'root'
})
export class Alert_Event_SMS_Service {
  constructor(private http: HttpClient, private router: Router) { }


  getAllEventsAlertSms(idUser: number) {
    const token = sessionStorage.getItem("token");
    if (!token) {
      this.router.navigate(['/login']);
    }
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<IAlertSMS_Event[]>(server + "events/getAllByUser" ,{id_usuario: idUser}, {headers});
  }
}
