
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { server } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Tickets } from '../interfaces/Tickets/tickets.inteface';

@Injectable({
  providedIn: 'root'
})

export class TicketsService {

  constructor(private http: HttpClient, private router: Router) { }

  //peticion para iniciar sesion
  createTickets(title: string, message: string, type: 'feedback'| 'help'| 'error' | 'billing' | 'other') {
    const token = sessionStorage.getItem("token");
    const idUser = sessionStorage.getItem("idUser");
    if (!token && !idUser) {
      this.router.navigate(['/login']);
    }
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<boolean>( server+"ticket/createTicket", {id_user_message: idUser, title, message, type}, {headers})
  }
  
    //peticion para iniciar sesion
    tickets() {
      const token = sessionStorage.getItem("token");
      const idUser = sessionStorage.getItem("idUser");
      if (!token && !idUser) {
        this.router.navigate(['/login']);
      }
      // Agrega el token Bearer al encabezado de la solicitud
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      
      return this.http.post<Tickets[]>( server+"ticket/tickets", {id_user: idUser}, {headers})
    }
}