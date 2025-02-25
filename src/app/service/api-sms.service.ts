import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { server } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiSmsService {

  constructor(private router: Router, private http: HttpClient) { }

  getTokenAPI_SMS() {
    const token = this.getToken();
    const id_usuario = this.getUser();
    if (!token && !id_usuario) {
      this.router.navigate(['/login']);
      return new Observable<string>();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<string>(`${server}images/create`, { id_usuario }, { headers });
  }

  /**
   * Obtiene el token de autenticación almacenado en el sessionStorage.
   * @returns El token de autenticación o null si no existe.
   */
  private getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  /**
  * Obtiene el id de usuario de autenticación almacenado en el sessionStorage.
  * @returns El id user de autenticación o null si no existe.
  */
  private getUser(): string | null {
    return sessionStorage.getItem('idUser')
  }
}
