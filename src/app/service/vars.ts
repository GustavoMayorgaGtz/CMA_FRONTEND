import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { IJsonVariable, IJsonVariable_Create } from '../interfaces/JsonEndpointsInterfaces/JsonEndpointI';
import { server } from 'src/environments/environment';
import { IMemoryVar, IModbusVar, IModbusVar_Create, IModbusVar_Test } from '../interfaces/Modbus.interfaces/ModbusInterfaces';
import { AllVar } from '../interfaces/interfaces';
import { Observable, ObservableLike } from 'rxjs';
import { IBlobData, IBlobData_Database } from '../interfaces/BlobData/blobdatainterfaces';
import { PRIMARY_OUTLET, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class VarsService {

  constructor(private http: HttpClient,
    private router: Router
  ) { }


  /**
   * Observable para obtener todas las variables de un usuario
   * @param primary_user 
   * @returns {Observable<AllVar[]>}
   */
  getAllVars(primary_user: number) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<AllVar[]>(server + `vars/get?primary_user=${primary_user}`, { headers });
  }


  /**
   * Observable para obener todas las variables json de un usuario
   * @param primary_user 
   * @returns {Observable<AllVar>}
   */
  getAllVarsJson(primary_user: number) {
    interface AllVar {
      json: IJsonVariable[]
    }
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<AllVar>(server + `jsonvars/getAll?primary_user=${primary_user}`, { headers });
  }


  /**
   * Observable para obtener una variable json por su id
   * @param idJsonVariable 
   * @param primary_user 
   * @returns 
   */
  getJsonVarById(idJsonVariable: number, primary_user: number) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<IJsonVariable[]>(server + `jsonvars/getOne?idjsonvar=${idJsonVariable}&primary_user=${primary_user}`, { headers });
  }


  create_Json_Var(body: IJsonVariable_Create, primary_user: number) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(server + "jsonvars/create", { ...body, primary_user }, { headers });
  }


  type_GET(url: string) {
    return this.http.get<Object>(url);
  }
  type_POST(url: string, body: Object): Observable<any> {
    const options = {
      headers: {
        'Origin': url
      }
    };
    return this.http.post<any>(url, body, options);
  }
  type_PUT(url: string, body: object) {
    return this.http.put<Object>(url, body);
  }
  type_OPTIONS(url: string, body: object) {
    return this.http.options<Object>(url, body);
  }
  type_DELETE(url: string, body: object) {
    return this.http.delete<Object>(url, body);
  }
  type_PATCH(url: string, body: object) {
    return this.http.patch<Object>(url, body);
  }
  type_HEAD(url: string, body: object) {
    return this.http.head<Object>(url, body);
  }




  test_Modbus_var(body: IModbusVar_Test) {
    
    return this.http.post(server + "modbusvars/testConnection", body);
  }

  getAllVarsModbus() {
    const idUser = sessionStorage.getItem('idUser')
    const token = sessionStorage.getItem("token")
    if(!idUser || !token){
       this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<IModbusVar[]>(server + `modbusvars/getAll?id_user=${idUser}`, {headers});
  }


  getModbusVarById(idmodbusvar: number) {
    const idUser = sessionStorage.getItem('idUser')
    const token = sessionStorage.getItem("token")
    if(!idUser || !token){
       this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<IModbusVar[]>(server + `modbusvars/getOne?idmodbusvar=${idmodbusvar}&id_user=${idUser}`, {headers});
  }

  create_Modbus_var(body: IModbusVar_Create) {
    const id_user = sessionStorage.getItem('idUser')
    const token = sessionStorage.getItem("token")
    if(!id_user || !token){
       this.router.navigate(['/login'])
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(server + "modbusvars/create", {...body, id_user}, {headers});
  }

  create_memory_var(name: string, expression: string) {
    return this.http.post<any>(server + "memoryvars/create", { name, expression });
  }


  getAllVarsMemory() {
    return this.http.get<IMemoryVar[]>(server + "memoryvars/getAll");
  }


  getMemoryVarById(idmemoryvar: number) {
    return this.http.get<IMemoryVar[]>(server + "memoryvars/getOne?idmemoryvar=" + idmemoryvar);
  }

  setValueBlobData(body: IBlobData) {
    return this.http.post<any>(server + "blobdata/insertValue", body);
  }

  getBlobDataById(idblobdata: number) {
    return this.http.post<IBlobData_Database>(server + "blobdata/getById", { idblobdata });
  }
}

