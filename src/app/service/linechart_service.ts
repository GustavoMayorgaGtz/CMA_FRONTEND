import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { IlineChartConfiguration, LineChartConfigurationDatabase } from '../interfaces/Line_ChartInterfaces/line_chartInterface';
import { server } from 'src/environments/environment';
import { IConfigurationShadow } from '../interfaces/TieldmapInterfaces/tieldmapinterfaces';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LineChartService {

  constructor(private http: HttpClient, private router: Router) { }

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

    return this.http.post<any>(server + "linechart/create", line_chart_configuration, { headers })
  }

  update_LineChart(token: string, line_chart_configuration: IlineChartConfiguration, id_graph_selected: number) {
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(server + "linechart/update", {...line_chart_configuration, id_chart: id_graph_selected}, { headers })
  }

  getOneById(idlinealchart: number) {
    const token = sessionStorage.getItem("token");
    const idUser = sessionStorage.getItem("idUser");
    if (!token && !idUser) {
      this.router.navigate(['/login']);
    }
    // Agrega el token Bearer al encabezado de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<LineChartConfigurationDatabase>(server + `linechart/getOne?idlinechart=${idlinealchart}&id_user=${idUser}`, { headers })
  }

  updatePositionAndSizeLineChart(params: IConfigurationShadow) {
    return this.http.post(server + "linechart/positions", params);
  }
}
