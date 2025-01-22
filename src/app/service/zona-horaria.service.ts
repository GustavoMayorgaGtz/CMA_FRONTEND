import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from 'src/environments/environment';
import { Zona_Horaria } from '../interfaces/Zona_Horaria/zona_horaria.interface';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ZonaHorariaService {

  constructor(private http: HttpClient, private router: Router) { }

  getZonaHoraria() {
    return this.http.get<Zona_Horaria[]>(server + "tools/zona_horaria");
  }

  updateZonaHoraria(zona_horaria: string) {
    const token = sessionStorage.getItem("token");
    const idUser = sessionStorage.getItem("idUser");
    if (!token && !idUser) {
      this.router.navigate(['/login']);
    }
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<boolean>(server + "tools/update_zona_horaria", { id_user: idUser, zona_horaria }, { headers })
  }

}
