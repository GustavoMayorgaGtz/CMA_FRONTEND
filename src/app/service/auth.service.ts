
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { login, register } from '../interfaces/LoginInterface/login.interface';
import { timeout } from 'rxjs';
import { server } from 'src/environments/environment';
import { access_functions, UsersRecive } from '../interfaces/GestionUsuarios/GestionUsuarios.Interface';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  //peticion para iniciar sesion
  login_user(body: login) {
    interface dataResponse{
      user: number,
      token: string
    }
    return this.http.post<dataResponse>( server+"auth/login", body)
  }






 //Peticion para registrar un usuario primario
  registerPrimaryUser(username: string, correo: string, password: string, telefono: string, zona_horaria: string) {
    return this.http.post<Object>(server+"auth/registerPrimaryUser", {username, correo, password, telefono, zona_horaria})
  }


  //Peticion para registrar un usuario secundario
  registerSecondaryUser(username: string, zona_horaria: string, correo: string, password: string, telefono: string, primaryUser: number, rango: access_functions, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(server+"auth/registerSecondaryUser", {username, correo, password, telefono, primaryUser, rango, zona_horaria}, {headers})
  }

   //Peticion para actualizar un usuario secundario
   updateUser(username: string, zona_horaria: string, correo: string, password: string, telefono: string, idUserQuery: number, idUserFactory: number, rango: access_functions, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    return this.http.post<any>(server+"auth/updateUser", {username, zona_horaria, correo, password, telefono, idUserQuery, rango, idUserFactory}, {headers})
  }

  //Peticion para actualizar el estado de un usuario secundario
  changeEnableduser( modify_id_user: number, enabled: boolean) {
    const id_user = sessionStorage.getItem('idUser')
    const token = sessionStorage.getItem("token")
    if(!id_user || !token){
       this.router.navigate(['/login'])
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    return this.http.post<any>(server+"auth/changeEnabledUser", {idUser: id_user, idUserModify: modify_id_user, enabled}, {headers})
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