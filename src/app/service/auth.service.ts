
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { login, register } from '../interfaces/LoginInterface/login.interface';
import { timeout } from 'rxjs';
import { server } from 'src/environments/environment';
import { access_functions, UsersRecive } from '../interfaces/GestionUsuarios/GestionUsuarios.Interface';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  //peticion para iniciar sesion
  login_user(body: login) {
    interface dataResponse{
      user: number,
      token: string
    }
    return this.http.post<dataResponse>( server+"auth/login", body)
  }



  //peticion para registrar usuario
  register_user(body: object) {
    return this.http.post<Object>(server+"auth/register", body)
  }


 //Peticion para registrar un usuario primario
  registerPrimaryUser(username: string, correo: string, password: string, telefono: string) {
    return this.http.post<Object>(server+"auth/registerPrimaryUser", {username, correo, password, telefono})
  }


  //Peticion para registrar un usuario secundario
  registerSecondaryUser(username: string, correo: string, password: string, telefono: string, primaryUser: number, rango: access_functions, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(server+"auth/registerSecondaryUser", {username, correo, password, telefono, primaryUser, rango}, {headers})
  }

   //Peticion para actualizar un usuario secundario
   updateUser(username: string, correo: string, password: string, telefono: string, idUserQuery: number, idUserFactory: number, rango: access_functions, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    return this.http.post<any>(server+"auth/updateUser", {username, correo, password, telefono, idUserQuery, rango, idUserFactory}, {headers})
  }

  //Observable para obtener los usuarios asociados a un usuario
  getOneUser(idUserQuery: number, find_id_user: number,  token: string){
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  return this.http.post<UsersRecive[]>(server+"auth/getOneUser", {idUserQuery, find_id_user}, {headers})
}

  //Observable para obtener los usuarios asociados a un usuario
  getUsers(idUser: number, token: string){
      // Agrega el token Bearer al encabezado de la solicitud
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.post<UsersRecive[]>(server+"auth/getUsers", {idUser}, {headers})
  }

  authUser(idUser: number, token: string){
      // Agrega el token Bearer al encabezado de la solicitud
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.post<any>(server+"auth/validateAuth", {idUser}, {headers})
  }

  
}