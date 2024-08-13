import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { IlineChartConfiguration, LineChartConfigurationDatabase } from '../interfaces/Line_ChartInterfaces/line_chartInterface';
import { server } from 'src/environments/environment';
import { IConfigurationShadow } from '../interfaces/TieldmapInterfaces/tieldmapinterfaces';
@Injectable({
  providedIn: 'root'
})
export class LineChartService {

  constructor(private http: HttpClient) { }


  getAllLineChart(token: string, id_user: number, id_dashboard: number) {
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<LineChartConfigurationDatabase[]>(server + `linechart/getAll?id_user=${id_user}&id_dashboard=${id_dashboard}`, { headers });
  }

  create_LineChart(token: string, line_chart_configuration: IlineChartConfiguration) {
       // Agrega el token Bearer al encabezado de la solicitud
       const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
    return this.http.post<any>(server + "linechart/create", line_chart_configuration, {headers})
  }

  getOneById(idlinealchart: number) {
    return this.http.get<LineChartConfigurationDatabase>(server + `linechart/getOne?idlinechart=${idlinealchart}`)
  }
  updatePositionAndSizeLineChart(params: IConfigurationShadow) {
    return this.http.post(server + "linechart/positions", params);
  }
}
