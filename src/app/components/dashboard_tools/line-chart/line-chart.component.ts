import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { LineGraph } from 'src/app/graphs_class/line_chart';
import { IlineChartConfiguration, getParamsLineChart } from 'src/app/interfaces/Line_ChartInterfaces/line_chartInterface';
import { AllVar } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { AllService } from 'src/app/service/all.service';
import { AuthService } from 'src/app/service/auth.service';
import { CMA_ENDPOINT_SERVICES } from 'src/app/service/cma_endpoints.service';
import { finalizeService } from 'src/app/service/finalize.service';
import { IntervalsService } from 'src/app/service/intervals.service';
import { LineChartService } from 'src/app/service/linechart_service';
import { VarsService } from 'src/app/service/vars';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges, OnDestroy {

  @Input('idlinechart') id!: number;
  public grafica_linear = new LineGraph(
    this.alert,
    this.varsService,
    this.authService,
    this.router,
    this.finalizeService,
    this.cma_endpointService,
    this.intervals_service);
  private linear_chart_configuration!: IlineChartConfiguration;
  @ViewChild(BaseChartDirective) canvas_chart!: BaseChartDirective;
  public linear1!: getParamsLineChart;
  public show: boolean = false;


  constructor(
    private all: AllService,
    private alert: AlertService,
    private varsService: VarsService,
    private router: Router,
    private authService: AuthService,
    private linechartservice: LineChartService,
    private finalizeService: finalizeService,
    private cma_endpointService: CMA_ENDPOINT_SERVICES,
    private intervals_service: IntervalsService) {
    this.getVariables();
  }
  ngOnDestroy(): void {
    this.grafica_linear.closeBlobData();
  }


  public Vars_names: string[] = [];
  public vars!: AllVar[];
  getVariables() {
    const idUser = sessionStorage.getItem("idUser")
    if(idUser){
      this.varsService.getAllVars(parseInt(idUser)).subscribe((vars) => {
        this.vars = vars;
        this.Vars_names = vars.map((vars) => {
          return vars.name;
        })
      });
    }
  
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.id) {
      const token = sessionStorage.getItem("token");
      const id_user = sessionStorage.getItem("idUser");
      if (token && id_user) {
        this.linechartservice.getOneById(this.id).subscribe((configuration) => {
          this.linear_chart_configuration = {
            id_usuario: configuration.id_usuario,
            id_dashboard: configuration.id_dashboard,
            general: {
              title: configuration.title,
              description: configuration.description,
              idVariableModbus: configuration.idvariablemodbus!,
              idVariableJson: configuration.idvariablejson!,
              idVariableMemory: configuration.idvariablememory!,
              idVariableEndpoint: configuration.idvariableendpoint!,
              sampling_number: configuration.sampling_number,
              isArray: configuration.isarray,
              issaveblobdata: configuration.issaveblobdata,
              idblobdata: configuration.idblobdata,
              polling: {
                time: configuration.polling_time,
                type: configuration.polling_type
              }
            },
            styles: {
              fill: configuration.fill,
              fill_color: configuration.fill_color,
              line: configuration.line,
              line_color: configuration.line_color,
              line_size: configuration.line_size,
              line_tension: configuration.line_tension,
              line_stepped: configuration.line_stepped,
              point_style: configuration.point_style,
              point_color: configuration.point_color,
              point_border_color: configuration.point_border_color,
              point_border_size: configuration.point_border_size,
              point_width: configuration.point_width
            }
          }
          this.redefineOptions();
        })
      } else {
        this.router.navigate(['/login'])
      }
    }
  }


  ngOnInit(): void {
  }


  /**
  * Funcion para cargar los cambios en la grafica actual cuando se detecta un nuevo valor o cambios en las entradas de configuracion
  */
  redefineOptions() {
    this.grafica_linear.reloadData(this.linear_chart_configuration, this.vars, this.Vars_names);
    this.grafica_linear.eventData.subscribe((graph_configuration) => {
      this.linear1 = graph_configuration;
      this.show = true;
      if (this.canvas_chart) {
        this.canvas_chart.chart?.update()
      }
    });
  }


}
