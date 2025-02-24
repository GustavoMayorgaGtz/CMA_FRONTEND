import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ScatterDataPoint } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { BaseChartDirective } from 'ng2-charts';
import { CalculatorExpression } from 'src/app/functions/calculatorExpression';
import { JsonVariableClass } from 'src/app/functions/json_functions';
import { LineGraph } from 'src/app/graphs_class/line_chart';
import { ICMA_ENDPOINT_DATABASE } from 'src/app/interfaces/CMA_EndpointInterfaces/cma_endpointInterface';
import { IJsonVariable } from 'src/app/interfaces/JsonEndpointsInterfaces/JsonEndpointI';
import { IlineChartConfiguration, getParamsLineChart } from 'src/app/interfaces/Line_ChartInterfaces/line_chartInterface';
import { IBlobdata, IMemoryVar, IModbusVar } from 'src/app/interfaces/Modbus.interfaces/ModbusInterfaces';
import { AllVar } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { AllService } from 'src/app/service/all.service';
import { AuthService } from 'src/app/service/auth.service';
import { BlobDataService } from 'src/app/service/blobdata_service';
import { CMA_ENDPOINT_SERVICES } from 'src/app/service/cma_endpoints.service';
import { ExitService } from 'src/app/service/exit.service';
import { finalizeService } from 'src/app/service/finalize.service';
import { IntervalsService } from 'src/app/service/intervals.service';
import { LineChartService } from 'src/app/service/linechart_service';
import { VarsService } from 'src/app/service/vars';

@Component({
  selector: 'app-configure-linear-graph',
  templateUrl: './configure-linear-graph.component.html',
  styleUrls: ['./configure-linear-graph.component.scss']
})
export class ConfigureLinearGraphComponent implements OnInit, OnChanges {

  //Se define la variable que define los datos que se van a capturar
  public linear_chart_configuration!: IlineChartConfiguration;
  public jsonBuilder = new JsonVariableClass(this.varsService, this.router, this.alert);
  @Input() id_dashboard_selected!: number | undefined;
  @Input() id_graph_selected!: number | undefined;
  @ViewChild(BaseChartDirective) canvas_chart!: BaseChartDirective;

  constructor(
    private alert: AlertService,

    private varsService: VarsService,
    private linechartService: LineChartService,
    private finalizeServices: finalizeService,
    private exitService: ExitService,
    private authService: AuthService,
    private endpointService: CMA_ENDPOINT_SERVICES,
    private router: Router,
    private blobServices: BlobDataService,
    private intervals_service: IntervalsService
  ) {
  }

  private id_blobdata_selected_by_graph: number = 0;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.id_graph_selected) {
        this.linechartService.getOneById(this.id_graph_selected).subscribe((chart_payload) => {
          if (chart_payload) {
            if (chart_payload.idblobdata)
              this.linear_chart_configuration.general.idblobdata = chart_payload.idblobdata;
            this.linear_chart_configuration.general.title = chart_payload.title;
            this.title = chart_payload.title;
            this.linear_chart_configuration.general.description = chart_payload.description;
            this.description = chart_payload.description;
            this.linear_chart_configuration.general.polling.time = chart_payload.polling_time;
            this.polling_time = chart_payload.polling_time;
            this.linear_chart_configuration.general.polling.type = chart_payload.polling_type;
            this.polling_type = chart_payload.polling_type;
            this.linear_chart_configuration.styles.line_stepped = chart_payload.line_stepped;
            this.line_stepped = chart_payload.line_stepped;
            this.linear_chart_configuration.general.sampling_number = chart_payload.sampling_number;
            this.sampling_number = chart_payload.sampling_number;
            this.linear_chart_configuration.styles.fill = chart_payload.fill;
            this.fill = chart_payload.fill;
            this.linear_chart_configuration.styles.fill_color = chart_payload.fill_color;
            this.fill_color = chart_payload.fill_color;
            this.linear_chart_configuration.styles.line = chart_payload.line;
            this.line = chart_payload.line;
            this.linear_chart_configuration.styles.line_color = chart_payload.line_color;
            this.line_color = chart_payload.line_color;
            this.linear_chart_configuration.styles.line_size = chart_payload.line_size;
            this.line_size = chart_payload.line_size;
            this.linear_chart_configuration.styles.line_tension = chart_payload.line_tension;
            this.line_tension = chart_payload.line_tension;
            this.linear_chart_configuration.styles.point_border_color = chart_payload.point_border_color;
            this.point_border_color = chart_payload.point_border_color;
            this.linear_chart_configuration.styles.point_border_size = chart_payload.point_border_size;
            this.point_border_size = chart_payload.point_border_size;
            this.linear_chart_configuration.styles.point_style = chart_payload.point_style;
            this.point_style = chart_payload.point_style;
            this.linear_chart_configuration.styles.point_color = chart_payload.point_color;
            this.point_color = chart_payload.point_color;
            this.linear_chart_configuration.styles.point_width = chart_payload.point_width;
            this.point_width = chart_payload.point_width;
            this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
          }
        }, (err: HttpErrorResponse) => {
          console.error(err.message)
          this.alert.setMessageAlert("Error al editar grafica.");
        })
      }
    }
  }
  public grafica_linear = new LineGraph(
    this.alert,
    this.varsService,
    this.authService,
    this.router,
    this.finalizeServices, this.endpointService,
    this.intervals_service);

  public linear1!: getParamsLineChart;


  public var1_labels: string[] = [];
  public var1_dataset: number[] = [];
  ngOnInit(): void {
    this.getVariables();
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }


  public jsonVariables: IJsonVariable[] = [];
  public blobdataVariables: IBlobdata[] = [];
  public memoryVariables: IMemoryVar[] = [];
  public endpointVariables: ICMA_ENDPOINT_DATABASE[] = [];
  public Vars_names: string[] = [];
  public vars!: AllVar[];
  getVariables() {
    const idUser = sessionStorage.getItem("idUser")
    if (idUser) {
      this.varsService.getAllVars(parseInt(idUser)).subscribe((vars) => {
        this.vars = vars;
        this.Vars_names = vars.map((vars) => {
          return vars.name;
        })
      });

      this.varsService.getAllVarsJson(parseInt(idUser)).subscribe((variables) => {
        this.jsonVariables = variables.json;
      }, (err: HttpErrorResponse) => {
        console.log(err);
      })


      this.blobServices.getAllBlobDataFromUser().subscribe((response) => {
        console.log("Blobdata")
        console.log(response);
        this.blobdataVariables = response;
      }, (err: HttpErrorResponse) => {
        console.log(err);
      })


      // this.varsService.getAllVarsModbus().subscribe((variables) => {
      //   this.modbusVariables = variables;
      // }, (err: HttpErrorResponse) => {
      //   console.log(err);
      // })
      this.varsService.getAllVarsMemory().subscribe((variables_memoria) => {
        if (variables_memoria.length > 0) {
          this.getNextResultMemoryVar(variables_memoria, 0, variables_memoria.length)
        }
      }, (err) => {
        this.alert.setMessageAlert(err);
        console.log(err.message)
      })

      this.endpointService.getAll_endpoints().subscribe((variables_endpoint) => {
        this.endpointVariables = variables_endpoint;
      }, (err: HttpErrorResponse) => {
        this.alert.setMessageAlert(err.message);
      })
    }

  }


  getNextResultMemoryVar(vars: IMemoryVar[], id: number, size: number) {
    const newRegex = new CalculatorExpression(this.varsService, this.router);
    newRegex.parserRegexVars(vars[id].expression, this.vars, this.Vars_names, this.jsonBuilder)
    newRegex.getMessage.subscribe((result) => {
      vars[id].result = parseFloat(result);
      if (id == size - 1) {
        this.memoryVariables = vars;
      } else {
        this.getNextResultMemoryVar(vars, (id + 1), size)
      }
    });
  }


  /*_______FUNCIONES_________________________________________________________________________*/

  public enableSave: boolean = true;
  /**
   * Funcion para guardar y validar todos los parametros de la grafica lineal
   */
  saveConfiguration_Event(): void {
    this.enableSave = false;
    //Comprobar parametros
    let readyToSave = true; //Variable de control
    //TITULO
    if ((!this.title || this.title.length > 200)) {
      this.alert.setMessageAlert("Define un titulo menor de 200 caracteres");
      readyToSave = false;
    }
    //DESCRIPCION
    if ((!this.description || this.description.length > 255)) {
      this.alert.setMessageAlert("Define una descripcion menor de 255 caracteres");
      readyToSave = false;
    }
    //IDVARIABLE
    if (!this.id_graph_selected || this.id_graph_selected == 0) {
      if (!this.idJsonVariable && !this.idBlobdata && !this.idModbusVariable && !this.idMemoryVariable && !this.idEndpointVariable) {
        this.alert.setMessageAlert("No haz definido la variable");
        readyToSave = false;
      }
    }
    //MUESTREO
    if (!this.sampling_number) {
      this.alert.setMessageAlert("No haz definido el numero de datos limites a graficar")
      readyToSave = false;
    }
    //POLLING_TIME
    if (!this.polling_time) {
      this.alert.setMessageAlert("Define el tiempo de refresco del dato");
      readyToSave = false;
    }
    //POLLING_TYPE
    if (!this.polling_type) {
      this.alert.setMessageAlert("Define el tipo tiempo de refresco del dato");
      readyToSave = false;
    }
    //COLOR DEL AREA
    if (this.fill) {
      if (!this.fill_color) {
        this.alert.setMessageAlert("Define el color del area");
        readyToSave = false;
      }
    }
    //COLOR DE LINEA
    if (this.line) {
      if (!this.line_color) {
        this.alert.setMessageAlert("Define el color de la linea conectora");
        readyToSave = false;
      }
      if (this.line_size == 0 || !this.line_size) {
        this.line_size = 1;
      }
      if (!this.line_tension) {
        this.setLine_Tension = "0.1";
      }
    }
    //ESTILO DEL PUNTO CONECTOR
    if (!this.point_style) {
      this.point_style = "circle";
    }
    //COLOR DEL PUNTO CONECTOR
    if (!this.point_color) {
      this.alert.setMessageAlert("Define un color para el punto conector");
      readyToSave = false;
    }
    //COLOR DEL BORDE DEL PUNTO CONECTO
    if (!this.point_border_color) {
      this.alert.setMessageAlert("Define el color del borde del punto conector");
      readyToSave = false;
    }
    //ID DEL DASHBOARD DONDE SE VA A CREAR
    if (!this.id_dashboard_selected || this.id_dashboard_selected <= 0) {
      this.alert.setMessageAlert("Ocurrio un error al seleccionar el dashboard.z");
      readyToSave = false;
    }
    //TAMAÑO DEL BORDE DEL PUNTO CONECTOR
    if (!this.point_border_size) {
      this.point_border_size = 2;
    }
    //TAMAÑO DEL PUNTO CONECTOR
    if (!this.point_width) {
      this.point_width = 5;
    }

    const token = sessionStorage.getItem("token");
    const idUser = sessionStorage.getItem("idUser");

    if (readyToSave && this.id_dashboard_selected && token && idUser && parseInt(idUser) > 0) {
      this.linear_chart_configuration = {
        id_usuario: parseInt(idUser),
        id_dashboard: this.id_dashboard_selected,
        general: {
          title: this.title,
          description: this.description,
          idVariableModbus: this.idModbusVariable,
          idVariableJson: this.idJsonVariable,
          idVariableMemory: this.idMemoryVariable,
          idVariableEndpoint: this.idEndpointVariable,
          sampling_number: this.sampling_number,
          isArray: this.isArray,
          issaveblobdata: (!this.idBlobdata)?this.isSaveBlobData:false,
          idblobdata: this.idBlobdata,
          polling: {
            time: this.polling_time,
            type: this.polling_type
          }
        },
        styles: {
          fill: this.fill,
          fill_color: this.fill_color,
          line: this.line,
          line_color: this.line_color,
          line_size: this.line_size,
          line_tension: this.line_tension,
          line_stepped: this.line_stepped,
          point_style: this.point_style,
          point_color: this.point_color,
          point_border_color: this.point_border_color,
          point_border_size: this.point_border_size,
          point_width: this.point_width
        }
      }

      if (this.id_graph_selected && this.id_graph_selected > 0) {
        this.linechartService.update_LineChart(token, this.linear_chart_configuration, this.id_graph_selected).subscribe((response) => {
          this.alert.setMessageAlert("Grafico Lineal actualizado exitosamente.");
          window.location.reload();
          this.enableSave = true;
        }, (err: HttpErrorResponse) => {
          this.enableSave = true;
          console.log(err);
        })
      } else {
        this.linechartService.create_LineChart(token, this.linear_chart_configuration).subscribe((response) => {
          this.alert.setMessageAlert("Grafico Lineal creado exitosamente.");
          window.location.reload();
          this.enableSave = true;
        }, (err: HttpErrorResponse) => {
          this.enableSave = true;
          console.log(err);
        })
      }

    } else {
      this.enableSave = true;
    }
  }

  /**
   * Funcion para seleccionar una variable json|modbus
   * @param idVariable 
   * @param type 
   */
  public idBlobdata:any = null;
  selectVariableToGraph(idVariable: number, type: number) {
    //Json
    if (type == 1) {
      this.idJsonVariable = idVariable;
      this.idModbusVariable = null;
      this.idMemoryVariable = null;
      this.idEndpointVariable = null;
      this.idBlobdata = null;
    }

    //Modbus
    if (type == 2) {
      this.idBlobdata = idVariable;
      this.linear_chart_configuration.general.idblobdata = idVariable;
      this.idModbusVariable = null;
      this.idJsonVariable = null;
      this.idMemoryVariable = null;
      this.idEndpointVariable = null;
      
    }
    if (type == 3) {
      this.idModbusVariable = null;
      this.idJsonVariable = null;
      this.idMemoryVariable = idVariable;
      this.idEndpointVariable = null;
      this.idBlobdata = null;
    }
    if (type == 4) {
      this.idModbusVariable = null;
      this.idJsonVariable = null;
      this.idMemoryVariable = null;
      this.idBlobdata = null;
      this.idEndpointVariable = idVariable;
    }
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }



  /**
   * Funcion para cargar los cambios en la grafica actual cuando se detecta un nuevo valor o cambios en las entradas de configuracion
   */
  public isVisible = true;
  redefineOptions(idblobdata?: number | null) {
    const idUser = sessionStorage.getItem("idUser");
    if (idUser && parseInt(idUser) > 0) {
      this.linear_chart_configuration = {
        id_usuario: parseInt(idUser),
        id_dashboard: this.id_dashboard_selected ? this.id_dashboard_selected : 0,
        general: {
          title: this.title,
          description: this.description,
          idVariableModbus: this.idModbusVariable,
          idVariableJson: this.idJsonVariable,
          idVariableMemory: this.idMemoryVariable,
          idVariableEndpoint: this.idEndpointVariable,
          sampling_number: this.sampling_number,
          isArray: this.isArray,
          idblobdata: this.idBlobdata,
          issaveblobdata: (this.idBlobdata)?false:this.isSaveBlobData,
          polling: {
            time: this.polling_time,
            type: this.polling_type
          }
        },
        styles: {
          fill: this.fill,
          fill_color: this.fill_color,
          line: this.line,
          line_color: this.line_color,
          line_size: this.line_size,
          line_tension: this.line_tension,
          line_stepped: this.line_stepped,
          point_style: this.point_style,
          point_color: this.point_color,
          point_border_color: this.point_border_color,
          point_border_size: this.point_border_size,
          point_width: this.point_width
        }
      }
      if (this.linear_chart_configuration.general.idblobdata != 0 && idblobdata) {
        this.grafica_linear.idBlobData = idblobdata;
        this.linear_chart_configuration.general.idblobdata = idblobdata;
        this.grafica_linear.enableBlobData = true;
      }
       
        this.grafica_linear.reloadData(this.linear_chart_configuration, this.vars, this.Vars_names, false, true);
        this.grafica_linear.eventData.subscribe((graph_configuration) => {
          this.linear1 = graph_configuration;
          if (this.canvas_chart) {
            // this.canvas_chart.chart?.reset()
            this.canvas_chart.chart?.update()
          }
        });
      

    } else {
      this.router.navigate(['/login']);
    }

  }




  /*_______VARIABLES Y ENCAPSULAMIENTO______________________________________________________*/
  private title: string = "Linear";
  set setTitle(title: string) {
    this.title = title;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private description: string = "Descripcion basica de una grafica lineal";
  set setDescription(description: string) {
    this.description = description;
  }

  private idJsonVariable: any = null;
  set setIdJsonVariable(idJson: number) {
    this.idJsonVariable = idJson;
  }

  private idModbusVariable: any = null;
  set setIdModbusVariable(idModbus: number) {
    this.idModbusVariable = idModbus;
  }

  private idMemoryVariable: any = null;
  set setIdMemoryVariable(idMemory: number) {
    this.idMemoryVariable = idMemory;
  }

  private idEndpointVariable: any = null;
  set setIdEndpointVariable(idEndpoint: number) {
    this.idEndpointVariable = idEndpoint;
  }

  private sampling_number: number = 100;
  set setSampling_number(muestreo: string) {
    this.sampling_number = parseInt(muestreo);
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  get getsampling_number() {
    return this.sampling_number;
  }

  private polling_time: number = 10;
  set setPolling_Time(time: string) {
    this.polling_time = parseInt(time);
    if ((this.polling_time < 10 && this.polling_type == "sg") || this.polling_time == 0) {
      this.polling_time = 10;
    }
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private polling_type: "sg" | "mn" | "hr" = "sg";
  set setPolling_Type(type: string) {
    if (type === "sg" || type === "mn" || type === "hr")
      this.polling_type = type;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private isArray: boolean = false;
  set set_isArray(value: boolean) {
    this.isArray = value;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private isSaveBlobData: boolean = false;
  set set_isSaveBlobData(value: boolean) {
    this.isSaveBlobData = value;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private fill: boolean = true;
  set setFill(value: boolean) {
    this.fill = value;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private fill_color: string = "#33556F";
  set setFill_Color(color: string) {
    this.fill_color = color;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private line: boolean = true;
  set setLine(line: boolean) {
    this.line = line;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private line_color: string = "#000000";
  set setLine_Color(color: string) {
    this.line_color = color;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private line_size: number = 2;
  set setline_Size(size: number) {
    this.line_size = size;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private line_tension: number = 0.8;
  set setLine_Tension(tension: string) {
    if (parseFloat(tension) >= 0 && parseFloat(tension) <= 1) {
      this.line_tension = parseFloat(tension);
      this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
    } else if (parseFloat(tension) > 1) {
      this.setLine_Tension = "1";
    }
    else if (parseFloat(tension) < 0) {
      this.setLine_Tension = "0";
    }
  }

  get getLine_Tension() {
    return this.line_tension
  }

  private line_stepped: boolean = false;
  set setLine_Stepped(stepped: boolean) {
    this.line_stepped = stepped;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private point_style: "circle" | "cross" | "crossRot" | "dash" | "line" | "rect" | "rectRounded" | "rectRot" | "star" | "triangle" = "circle";

  set setPoint_Style(style: string) {
    if (["circle", "cross", "crossRot", "dash", "line", "rect", "rectRounded", "rectRot", "star", "triangle"].includes(style)) {
      this.point_style = style as "circle" | "cross" | "crossRot" | "dash" | "line" | "rect" | "rectRounded" | "rectRot" | "star" | "triangle";
      this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
    }
  }

  private point_color: string = "#33556F";
  set setPoint_Color(color: string) {
    this.point_color = color;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private point_border_color: string = "#ffffff";
  set setPoint_Border_Color(color: string) {
    this.point_border_color = color;
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private point_border_size: number = 2;
  set setPoint_Border_Size(size: string) {
    this.point_border_size = parseFloat(size);
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  private point_width: number = 2;
  set setPoint_Width(width: string) {
    this.point_width = parseFloat(width);
    this.redefineOptions((this.linear_chart_configuration && this.linear_chart_configuration.general) ? this.linear_chart_configuration.general.idblobdata : null);
  }

  /**
   * Se usa esta funcion para obtener el objeto de la grafica
   * @param graficas 
   * @returns 
   */
  public chart!: BaseChartDirective<"line", (number | ScatterDataPoint | null)[], unknown>;
  obtenerObjeto(graficas: HTMLCanvasElement) {
    this.chart = graficas as unknown as BaseChartDirective<"line", (number | ScatterDataPoint | null)[], unknown>;
    return {};
  }


  /**
   * Funcion para regresar al menu principal y salir del modo configuracion
   */
  return() {
    // this.exitService.setExitConfigurationGraphLine(false);
    window.location.reload();
  }
}