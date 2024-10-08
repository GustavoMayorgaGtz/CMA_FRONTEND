import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { server } from 'src/environments/environment';
import { ICMA_ENDPOINT_CREATE, ICMA_ENDPOINT_CREATE_RESPONSE, ICMA_ENDPOINT_DATABASE } from '../interfaces/CMA_EndpointInterfaces/cma_endpointInterface';
import { IBlobData_Database } from '../interfaces/BlobData/blobdatainterfaces';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CMA_ENDPOINT_SERVICES {

  constructor(private http: HttpClient, private router: Router) { }

  create_endpoint(body: ICMA_ENDPOINT_CREATE){ 
    const id_user = sessionStorage.getItem('idUser')
    const token = sessionStorage.getItem("token")
    if(!id_user || !token){
       this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ICMA_ENDPOINT_CREATE_RESPONSE>(server + "cma_endpoint/create", {...body, id_user}, {headers});
  }

  getAll_endpoints(){ 
    const id_user = sessionStorage.getItem('idUser')
    const token = sessionStorage.getItem("token")
    if(!id_user || !token){
       this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ICMA_ENDPOINT_DATABASE[]>(server + `cma_endpoint/getAll?id_user=${id_user}`, {headers});
  }

  getOneEndpointById(id_endpoint:number , sizeActualArray: number, limit: number){
    const id_user = sessionStorage.getItem('idUser')
    const token = sessionStorage.getItem("token")
    if(!id_user || !token){
       this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<IBlobData_Database[]>(server+"cma_endpoint/getLastLineChartValues", {id_endpoint, sizeActualArray, limit, id_user}, {headers});
  }
}
