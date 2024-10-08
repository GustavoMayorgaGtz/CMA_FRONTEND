import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from 'src/environments/environment';
import { IBlobData_Database } from '../interfaces/BlobData/blobdatainterfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BlobDataService {

  constructor(private http: HttpClient, private router: Router) { }


  getOneBlobDataById(idblobdata: number){
    const id_user = sessionStorage.getItem('idUser')
    const token = sessionStorage.getItem("token")
    if(!id_user || !token){
       this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
     return this.http.post<IBlobData_Database>(server + "blobdata/getById", {idblobdata, id_user}, {headers});
  }

}
