import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { server } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentServices {

  constructor(private http: HttpClient, private router: Router) { }

  /**
 * Sube una nueva imagen al servidor.
 * @param imageData Datos de la imagen a subir.
 * @returns Observable con la respuesta del servidor.
 */
  createCustomer(paymentMethodId: any, price_id: string): Observable<string> {
    const token = this.getToken();
    var primary_user_str = this.getUser();

    if (token && primary_user_str) {
      let primary_user = parseInt(primary_user_str);
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.post<string>(`${server}payments/create-customer`, { paymentMethodId, price_id, userId: primary_user }, { headers });
    } else {
      this.router.navigate(['/login']);
      return new Observable<string>();
    }
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

