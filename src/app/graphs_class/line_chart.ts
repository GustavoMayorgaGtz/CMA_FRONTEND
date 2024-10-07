import { ChartConfiguration, ChartOptions } from 'chart.js';
import { IlineChartConfiguration, getParamsLineChart } from '../interfaces/Line_ChartInterfaces/line_chartInterface';
import { IJsonVariable } from '../interfaces/JsonEndpointsInterfaces/JsonEndpointI';
import { AlertService } from '../service/alert.service';
import { VarsService } from '../service/vars';
import { AllService } from '../service/all.service';
import { JsonVariableClass } from '../functions/json_functions';
import { EventEmitter } from '@angular/core';
import { IMemoryVar } from '../interfaces/Modbus.interfaces/ModbusInterfaces';
import { CalculatorExpression } from '../functions/calculatorExpression';
import { AllVar } from '../interfaces/interfaces';
import { BLOBDATA } from '../functions/blobdata_class';
import { finalizeService } from '../service/finalize.service';
import { CMA_ENDPOINT_SERVICES } from '../service/cma_endpoints.service';
import { HttpErrorResponse } from '@angular/common/http';
import { timeout } from 'rxjs';
import { BlobdataModule } from '../pages/blobdata/blobdata.module';

export class LineGraph {
  public jsonBuilder = new JsonVariableClass(this.varsService, this.alertService);
  public blobData = new BLOBDATA(this.varsService);
  private title = "Lineal";

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
    ],
    datasets: [
      {
        data: [],

        // label: this.title,
        // this dataset is drawn below

        fill: true,
        tension: 0.4,
        borderColor: 'black',
        backgroundColor: 'rgb(51, 85, 111)',
        pointBorderWidth: 1,
        pointBackgroundColor: 'rgb(51, 85, 111)',
        borderWidth: 1,
        showLine: true,
        animation: false

      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    // showLine: false,
    responsive: true,
    plugins: {
      // title: {
      //   display: true,
      //   text: 'Custom Chart Title'
      // },
      subtitle: {
        display: true, 
        fullSize:  true,
        padding: 10,
        font: {weight: 'bold'},
        text: ''
      },

      tooltip: {
        enabled: true // Opcional: controla si los tooltips están habilitados
      }
    },
    maintainAspectRatio: false, // Esto permite que el gráfico no mantenga un aspecto de cuadrado
    scales: {
      x: {
        alignToPixels: true,
        beginAtZero: false,
        ticks: {
          maxRotation: 100,
          autoSkip: true,
          minRotation: 35
        }
      },
      y: {
        beginAtZero: false,
        ticks: {
          // stepSize: .1  // Paso entre cada marca en el eje Y
        }
      }
    }
  };

  // public lineChartOptions: ChartOptions<'line'> = {
  //   responsive: true,
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: 'Custom Chart Title'
  //     },
  //     subtitle: {
  //       display: true,
  //       text: 'Custom Chart Subtitle'
  //     },
  //     legend: {
  //       display: false,
  //       maxWidth: 0,
  //       labels: {
  //           color: 'rgb(255, 99, 132)'
  //       }
  //     }
  //   },
  //   maintainAspectRatio: false, // Esto permite que el gráfico no mantenga un aspecto de cuadrado
  //   scales: {
  //     x: {
  //       alignToPixels: true,
  //       beginAtZero: false,
  //       // stacked: true,        
  //       // display: false,
  //       ticks: {
  //         maxRotation: 100,
  //         autoSkip: true,
  //         minRotation: 35
  //       }
  //     },
  //     y: {
  //       // display: false,
  //       // stacked: true,
  //       beginAtZero: false,
  //       ticks: {

  //         // stepSize: .1  // Paso entre cada marca en el eje Y
  //       }
  //     }
  //   }
  // };

  constructor(private service: AllService,
    private alertService: AlertService,
    private varsService: VarsService,
    private finalizeService: finalizeService,
    private cma_endpoint: CMA_ENDPOINT_SERVICES) {
    //Simulador de destructor desde otros lados
    finalizeService.finalizeAllPolling.subscribe(() => {
      if (this.idInterval) {
        clearInterval(this.idInterval);
      }
    })
  }


  /**
   * Funcion para agrupar por fecha, la opcion indica si es por minuto, hora, dia, mes o año
   * @param option opcion del metodo de agrupamiento
   */
  public groupByDateOption: number = 0;
  groupByDate(option: number) {
    this.groupByDateOption = option;
    const values = this.copyDataBlobData;
    const dates = this.copyDateBlobData;
    switch (option) {
      case 1: {
        //Normal
        if (this.copyDataBlobData.length + 1 > this.muestreo) {
          const restarCount = (this.copyDataBlobData.length + 1) - (this.muestreo + 1);
          this.copyDataBlobData.splice(0, restarCount);
          this.copyDateBlobData.splice(0, restarCount);
        }
        this.setValueData(this.copyDataBlobData)
        this.setValueLabel(this.copyDateBlobData)
        break;
      }
      /*********************************************************************/
      case 2: {
        //Minutos
        let lastFecha = "";
        let lastHora = 0;
        let lastMinuto = 0;
        const newDate: string[] = [];
        const newValue: number[] = [];
        let suma = 0;
        let contador = 0;

        dates.forEach((fecha, idx) => {
          const date = fecha.split(" ");
          const timeArray = date[1].split(":");
          const hora = parseInt(timeArray[0]);
          const minuto = parseInt(timeArray[1]);

          if (idx == (dates.length - 1)) {
            if ((lastFecha == date[0] && lastHora == hora && lastMinuto == minuto)) {
              newDate.push(date[0] + " " + `${hora}:${minuto}`);
              newValue.push((suma / contador));
            } else {

              newDate.push(lastFecha + " " + `${lastHora}:${lastMinuto}`);
              newValue.push((suma / contador));
              newDate.push(date[0] + " " + `${hora}:${minuto}`);
              newValue.push((values[idx]));
            }
          } else if (idx != 0 && lastFecha == date[0] && lastHora == hora && lastMinuto == minuto) {
            suma += values[idx];
            contador++;
          } else if (idx == 0) {
            lastFecha = date[0];
            lastHora = hora;
            lastMinuto = minuto;
            suma += values[idx];
            contador++;
          } else {
            newDate.push(lastFecha + " " + `${lastHora}:${lastMinuto}`);
            newValue.push((suma / contador));
            lastFecha = date[0];
            lastHora = hora;
            lastMinuto = minuto;
            suma = values[idx];
            contador = 1;
          }
          lastFecha = date[0];
        })
        if (newValue.length + 1 > this.muestreo) {
          const restarCount = (newValue.length + 1) - (this.muestreo + 1);
          newValue.splice(0, restarCount);
        }
        if (newDate.length + 1 > this.muestreo) {
          const restarCount = (newDate.length + 1) - (this.muestreo + 1);
          newDate.splice(0, restarCount);
        }

        this.setValueData(newValue);
        this.setValueLabel(newDate);
        break;
      }
      /*********************************************************************/
      case 3: {
        //Horas
        let lastFecha = "";
        let lastHora = 0;

        const newDate: string[] = [];
        const newValue: number[] = [];
        let suma = 0;
        let contador = 0;
        dates.forEach((fecha, idx) => {
          const date = fecha.split(" ");
          const timeArray = date[1].split(":");
          const hora = parseInt(timeArray[0]);

          if (idx == (dates.length - 1)) {
            if (lastFecha == date[0] && lastHora == hora) {
              newDate.push(date[0] + " " + `${hora}:xx`);
              newValue.push((suma / contador));
            } else {
              newDate.push(lastFecha + " " + `${lastHora}:xx`);
              newValue.push((suma / contador));
              newDate.push(date[0] + " " + `${hora}:xx`);
              newValue.push((values[idx]));
            }

          } else if (idx != 0 && lastFecha == date[0] && lastHora == hora) {
            suma += values[idx];
            contador++;
          } else if (idx == 0) {
            lastFecha = date[0];
            lastHora = hora;
            suma += values[idx];
            contador++;
          } else {
            newDate.push(lastFecha + " " + `${lastHora}:xx`);
            newValue.push((suma / contador));
            lastFecha = date[0];
            lastHora = hora;
            suma = values[idx];
            contador = 1;
          }
          lastFecha = date[0];
        })
        if (newValue.length + 1 > this.muestreo) {
          const restarCount = (newValue.length + 1) - (this.muestreo + 1);
          newValue.splice(0, restarCount);
        }
        if (newDate.length + 1 > this.muestreo) {
          const restarCount = (newDate.length + 1) - (this.muestreo + 1);
          newDate.splice(0, restarCount);
        }
        this.setValueData(newValue);
        this.setValueLabel(newDate);
        break;
      }
      /*********************************************************************/
      case 4: {
        //Dia
        const newDate: string[] = [];
        const newValue: number[] = [];
        let suma = 0;
        let contador = 0;
        let lastDay = 0;
        let lastMonth = 0;
        let lastYear = 0;
        dates.forEach((fecha, idx) => {
          const date = fecha.split(" ");
          const dateArr = date[0].split("-");
          let day = parseInt(dateArr[0])
          let month = parseInt(dateArr[1])
          let year = parseInt(dateArr[2])
          if (idx == (dates.length - 1)) {
            if (lastYear == year && lastMonth == month && lastDay == day) {
              suma += values[idx];
              contador++;
              newDate.push(date[0]);
              newValue.push((suma / contador));
            } else {
              newDate.push(`${lastDay}-${lastMonth}-${lastYear}`);
              newValue.push((suma / contador));
              newDate.push(date[0]);
              newValue.push((values[idx]));
            }
          } else if (idx != 0 && lastYear == year && lastMonth == month && lastDay == day) {
            suma += values[idx];
            contador++;
          } else if (idx == 0) {
            suma += values[idx];
            contador++;
            lastDay = day;
            lastMonth = month;
            lastYear = year;
          } else {
            newDate.push(`${lastDay}-${lastMonth}-${lastYear}`);
            newValue.push((suma / contador));
            suma = values[idx];
            contador = 1;
            lastDay = day;
            lastMonth = month;
            lastYear = year;
          }
        })
        if (newValue.length + 1 > this.muestreo) {
          const restarCount = (newValue.length + 1) - (this.muestreo + 1);
          newValue.splice(0, restarCount);
        }
        if (newDate.length + 1 > this.muestreo) {
          const restarCount = (newDate.length + 1) - (this.muestreo + 1);
          newDate.splice(0, restarCount);
        }
        this.setValueData(newValue);
        this.setValueLabel(newDate);
        break;
      }
      case 5: {
        //Mes
        const newDate: string[] = [];
        const newValue: number[] = [];
        let suma = 0;
        let contador = 0;
        let lastMonth = 0;
        let lastYear = 0;
        dates.forEach((fecha, idx) => {
          const date = fecha.split(" ");
          const dateArr = date[0].split("-");
          let month = parseInt(dateArr[1])
          let year = parseInt(dateArr[2])
          if (idx == (dates.length - 1)) {
            newDate.push(`xx-${lastMonth}-${lastYear}`);
            newValue.push((suma / contador));
          } else if (idx != 0 && lastYear == year && lastMonth == month) {
            suma += values[idx];
            contador++;
          } else if (idx == 0) {
            lastMonth = month;
            lastYear = year;
            suma += values[idx];
            contador++;
          } else {
            newDate.push(`xx-${lastMonth}-${lastYear}`);
            newValue.push((suma / contador));
            suma = values[idx];
            contador = 1;
            lastMonth = month;
            lastYear = year;
          }
        })
        if (newValue.length + 1 > this.muestreo) {
          const restarCount = (newValue.length + 1) - (this.muestreo + 1);
          newValue.splice(0, restarCount);
        }
        if (newDate.length + 1 > this.muestreo) {
          const restarCount = (newDate.length + 1) - (this.muestreo + 1);
          newDate.splice(0, restarCount);
        }
        this.setValueData(newValue);
        this.setValueLabel(newDate);
        break;
      }
      case 6: {
        //Año
        const newDate: string[] = [];
        const newValue: number[] = [];
        let suma = 0;
        let contador = 0;
        let lastYear = 0;
        dates.forEach((fecha, idx) => {
          const date = fecha.split(" ");
          const dateArr = date[0].split("-");
          let year = parseInt(dateArr[2])
          if (idx == (dates.length - 1)) {
            newDate.push(date[0]);
            newValue.push((suma / contador));
          } else if (idx != 0 && lastYear == year) {
            suma += values[idx];
            contador++;
          } else if (idx == 0) {
            suma += values[idx];
            contador++;
            lastYear = year;
          } else {
            newDate.push(`xx-xx-${lastYear}`);
            newValue.push((suma / contador));
            suma = values[idx];
            contador = 1;
            lastYear = year;
          }
        })
        if (newValue.length + 1 > this.muestreo) {
          const restarCount = (newValue.length + 1) - (this.muestreo + 1);
          newValue.splice(0, restarCount);
        }
        if (newDate.length + 1 > this.muestreo) {
          const restarCount = (newDate.length + 1) - (this.muestreo + 1);
          newDate.splice(0, restarCount);
        }
        this.setValueData(newValue);
        this.setValueLabel(newDate);
        break;
      }
    }
  }


  /**
   * Funcion para asignar los datos a la grafica
   * @param array_number 
   * @param isMuestreo 
   */
  setValueData(array_number: number[]) {
    //Validamos si la copia original de los datos supera el numero de muestreo
    if (array_number.length > this.muestreo) {
      const restarCount = (array_number.length + 1) - (this.muestreo);
      array_number.splice(0, restarCount);
    }
    this.var1_dataset = array_number;
    this.lineChartData.datasets[0].data = array_number;
    this.eventData.emit({
      lineChartData: this.lineChartData,

      lineChartOptions: this.lineChartOptions
    });
  }



  public muestreo = 0;
  /**
   * 
   * @param array_labels 
   * @param isMuestreo 
   */
  setValueLabel(array_labels: string[]) {

    //Validamos si la copia original de los datos supera el numero de muestreo
    if (array_labels.length > this.muestreo) {
      const restarCount = (array_labels.length + 1) - (this.muestreo);
      array_labels.splice(0, restarCount);
    }

    this.var1_labels = array_labels;
    this.lineChartData.labels = array_labels;
    this.eventData.emit({
      lineChartData: this.lineChartData,
      lineChartOptions: this.lineChartOptions
    });
  }

  defaultParams() {
    const nuevoobjecto = {
      lineChartData: this.lineChartData,
      lineChartOptions: this.lineChartOptions
    };

    return nuevoobjecto;
  }

  public eventData: EventEmitter<getParamsLineChart> = new EventEmitter<getParamsLineChart>();
  sendParams() {
  }


  /**
   * Funcion para establecer el muestreo
   * @param value string
   */
  setMuestreo(value: string) {
    this.muestreo = parseInt(value);
    /*
       Reinicio las variables con los datos
     */
    this.no_de_elementos_recibidos = 0;
    if (this.idInterval) {
      clearInterval(this.idInterval);
    }
    this.copyDataBlobData = [];
    this.copyDateBlobData = [];
    this.executeQuerysAndPollingsVars(this.option_global, this.vars_global, this.varsName_global);

    // /* 
    //    Se crea dos arreglos para guardar la informacion esta
    //    copia son los datos totales de blobData
    // */
    // let copiaData: number[] = [];
    // let copiaDate: string[] = [];

    // copiaData = this.copyDataBlobData
    // copiaDate = this.copyDateBlobData

    // this.setValueData(copiaData);
    // this.setValueLabel(copiaDate);
  }

  public enableBlobData: boolean = false;
  public idBlobData: number | null = 0;
  private copyDataBlobData: number[] = [];
  private copyDateBlobData: string[] = [];

  private option_global!: IlineChartConfiguration;
  private vars_global !: AllVar[];
  private varsName_global !: string[];
  reloadData(option: IlineChartConfiguration, vars?: AllVar[], varsName?: string[]) {
    //Asignar Variables en caso del muestreo
    this.option_global = option;
    if (vars)
      this.vars_global = vars;
    if (varsName)
      this.varsName_global = varsName;

    //BlobData operations
    if (!this.enableBlobData) {
      this.idBlobData = option.general.idblobdata;
      this.muestreo = option.general.sampling_number;
      if (this.idBlobData)
        this.blobData.getBlobData(this.idBlobData)
          .then((response) => {
            this.copyDataBlobData = response.value;
            this.copyDateBlobData = response.register_date;
            let copiaData: number[] = [];
            let copiaDate: string[] = [];
            copiaData = copiaData.concat(this.copyDataBlobData)
            copiaDate = copiaDate.concat(this.copyDateBlobData)
            this.setValueData(copiaData);
            this.setValueLabel(copiaDate);
            this.enableBlobData = true;
          })
          .catch((err) => {
            this.enableBlobData = true;
          })
    }


    //Estilos de la grafica lineal
    if (this.lineChartOptions.plugins) {
      if (this.lineChartOptions.plugins.subtitle) {
        this.lineChartOptions.plugins.subtitle.text = option.general.description;
        this.lineChartOptions.plugins.subtitle.color = option.styles.point_color;
      }
    }
    this.lineChartData.datasets[0].label = option.general.title;
    this.lineChartData.datasets[0].fill = option.styles.fill;
    this.lineChartData.datasets[0].backgroundColor = option.styles.fill_color;
    this.lineChartData.datasets[0].showLine = option.styles.line;
    this.lineChartData.datasets[0].borderColor = option.styles.line_color;
    this.lineChartData.datasets[0].borderWidth = option.styles.line_size;
    this.lineChartData.datasets[0].tension = option.styles.line_tension;
    this.lineChartData.datasets[0].stepped = option.styles.line_stepped;
    this.lineChartData.datasets[0].pointStyle = option.styles.point_style;
    this.lineChartData.datasets[0].pointBackgroundColor = option.styles.point_color;
    this.lineChartData.datasets[0].pointBorderWidth = option.styles.point_border_size;
    this.lineChartData.datasets[0].pointBorderColor = option.styles.point_border_color;
    this.lineChartData.datasets[0].pointRadius = option.styles.point_width;
    this.executeQuerysAndPollingsVars(option, vars, varsName);
  }




  private no_de_elementos_recibidos: number = 0;
  /**
   * @file line_chart.ts
   * @description Ejecuta las consultas por tipo y su respectivo polling
   * @param option 
   * @param vars 
   * @param varsName 
   */
  executeQuerysAndPollingsVars(option: IlineChartConfiguration, vars?: AllVar[], varsName?: string[]) {
    //Calcular tiempo en milisgundos del polling
    let time = 100000; //Valor default de 10 segundos
    const tiempoEntrada = option.general.polling.time;
    switch (option.general.polling.type) {
      case 'sg': {
        time = tiempoEntrada * 1000;
        break;
      }
      case 'mn': {
        time = tiempoEntrada * 60 * 1000;
        break;
      }
      case 'hr': {
        time = tiempoEntrada * 60 * 60 * 1000;
        break;
      }
    }

    //Configuracion con la peticion asignada a la grafica
    if (option.general.idVariableJson) {
      //Protocolo "http
      this.getVariableJson(option.general.idVariableJson, time);
    } else if (option.general.idVariableModbus) {
      //Protocolo modbus tcp/ip
      this.getVariableModbus(option.general.idVariableModbus, time);
    } else if (option.general.idVariableMemory) {
      //Variable de memoria 
      this.varsService.getMemoryVarById(option.general.idVariableMemory).subscribe((variable) => {
        if (vars && varsName) {
          this.getNextResultMemoryVar(variable, 0, 1, vars, varsName);
          //Polling
          //Limpiamos el intervalo 
          if (this.idInterval) {
            clearInterval(this.idInterval);
          }
          this.idInterval = setInterval(() => {
            this.getNextResultMemoryVar(variable, 0, 1, vars, varsName);
          }, time)
        }
      })
    } else if (option.general.idVariableEndpoint) {
      this.getVariableEndpoint(option.general.idVariableEndpoint, time);
    }
  }


  getNextResultMemoryVar(vars: IMemoryVar[], id: number, size: number, allvars: AllVar[], varsName: string[]) {
    const date = new Date();
    const dateNow = date.toLocaleString().replace(",", "").replaceAll("/", "-");
    const newRegex = new CalculatorExpression(this.varsService);
    newRegex.parserRegexVars(vars[id].expression, allvars, varsName, this.jsonBuilder)
    newRegex.getMessage.subscribe((result) => {
      const result_number = parseFloat(result);
      if (id == size - 1) {
        if (result_number && typeof result_number == 'number') {
          if (this.var1_dataset.length + 1 > this.muestreo) {
            const restarCount = (this.var1_dataset.length + 1) - (this.muestreo);
            this.var1_dataset.splice(0, restarCount);
            this.var1_labels.splice(0, restarCount);
          }
          this.var1_dataset.push(result_number);
          this.var1_labels.push(this.parsearFecha(dateNow));
          this.copyDataBlobData.push(result_number);
          this.copyDateBlobData.push(this.parsearFecha(dateNow));
          if (this.groupByDateOption > 0) {
            this.groupByDate(this.groupByDateOption)
          } else {
            this.lineChartData.datasets[0].data = this.var1_dataset;
            this.lineChartData.labels = this.var1_labels;
          }
          this.eventData.emit({
            lineChartData: this.lineChartData,
            lineChartOptions: this.lineChartOptions
          });
        }
      } else {

        this.getNextResultMemoryVar(vars, (id + 1), size, allvars, varsName)
      }
    });
  }

  public var1_labels: string[] = [];
  public var1_dataset: number[] = [];
  getVariableJson(idJsonVar: number, time: number) {
    this.varsService.getJsonVarById(idJsonVar).subscribe((jsonVar) => {
      this.pollingQueryJSON(jsonVar[0], time);
    })
  }


  parsearFecha(date: string) {
    let resultado = "";
    let arreglo1 = date.split(/[ /:\-]+/);
    resultado = `${(arreglo1[0].length > 1) ? arreglo1[0] : ("0" + arreglo1[0])}-${(arreglo1[1].length > 1) ? arreglo1[1] : ("0" + arreglo1[1])}-${arreglo1[2][2]}${arreglo1[2][3]} ${arreglo1[3]}:${arreglo1[4]}`
    return resultado;
  }





  getVariableEndpoint(idEndpoint: number, time: number) {
    this.cma_endpoint.getOneEndpointById(idEndpoint, 0, this.muestreo).subscribe((blobdata) => {
      this.var1_dataset = [];
      this.var1_labels = [];
      this.copyDataBlobData = [];
      this.copyDateBlobData = [];
      this.no_de_elementos_recibidos = 0;

      if (blobdata.length > 0) {
        blobdata[0].register_date.forEach((datenow, idx) => {
          if (this.var1_dataset.length + 1 > this.muestreo) {
            const restarCount = (this.var1_dataset.length + 1) - (this.muestreo);
            this.var1_dataset.splice(0, restarCount);
            this.var1_labels.splice(0, restarCount);
          }

          this.var1_dataset.push(blobdata[0].value[idx]);
          this.var1_labels.push(datenow);

          this.copyDataBlobData.push(blobdata[0].value[idx]);
          this.copyDateBlobData.push(datenow);
        })

        this.no_de_elementos_recibidos = this.copyDataBlobData.length;

        if (this.groupByDateOption > 0) {
          this.groupByDate(this.groupByDateOption)
        } else {
          this.lineChartData.datasets[0].data = this.var1_dataset;
          this.lineChartData.labels = this.var1_labels;
        }
        this.eventData.emit({
          lineChartData: this.lineChartData,
          lineChartOptions: this.lineChartOptions
        });
      } else {
        this.alertService.setMessageAlert("No hay valores en este espacio.")
      }
    }, (err: HttpErrorResponse) => {
      console.log(err);
    }, () => {
      //Polling
      //Limpiamos el intervalo 
      if (this.idInterval) {
        clearInterval(this.idInterval);
      }
      this.idInterval = setInterval(() => {
        this.cma_endpoint.getOneEndpointById(idEndpoint, this.no_de_elementos_recibidos, this.muestreo)
          // .pipe(timeout(time < 3000 ? 3000 : time))
          .subscribe((blobdata) => {
            if (blobdata && blobdata.length > 0) {
              if (blobdata[0]) {
                blobdata[0].register_date.forEach((datenow, idx) => {
                  if (this.var1_dataset.length + 1 > this.muestreo) {
                    const restarCount = (this.var1_dataset.length + 1) - (this.muestreo);
                    this.var1_dataset.splice(0, restarCount);
                    this.var1_labels.splice(0, restarCount);
                  }

                  this.var1_dataset.push(blobdata[0].value[idx]);
                  this.var1_labels.push(datenow);
                  this.copyDataBlobData.push(blobdata[0].value[idx]);
                  this.copyDateBlobData.push(datenow);
                })

                this.no_de_elementos_recibidos = this.copyDataBlobData.length;

                if (this.groupByDateOption > 0) {
                  this.groupByDate(this.groupByDateOption)
                } else {
                  this.lineChartData.datasets[0].data = this.var1_dataset;
                  this.lineChartData.labels = this.var1_labels;
                }
                this.eventData.emit({
                  lineChartData: this.lineChartData,
                  lineChartOptions: this.lineChartOptions
                });
              }

            }
          }, (err: HttpErrorResponse) => {
            console.log(err);
          })
      }, time < 3000 ? 3000 : time)
    })
  }



  getVariableModbus(idmodbusvar: number, time: number) {
    //Primer peticion
    const date = new Date();
    const dateNow = date.toLocaleString().replace(",", "").replaceAll("/", "-");

    this.varsService.getModbusVarById(idmodbusvar).subscribe((modbusVar) => {
      if (modbusVar.length > 0 && modbusVar[0].value.length > 0) {
        const value: number = modbusVar[0].value[0];

        if (value && typeof value == 'number') {
          if (this.var1_dataset.length + 1 > this.muestreo) {
            const restarCount = (this.var1_dataset.length + 1) - (this.muestreo);
            this.var1_dataset.splice(0, restarCount);
            this.var1_labels.splice(0, restarCount);
          }
          this.var1_dataset.push(value);
          this.var1_labels.push(this.parsearFecha(dateNow));
          this.copyDataBlobData.push(value);
          this.copyDateBlobData.push(this.parsearFecha(dateNow));
          if (this.groupByDateOption > 0) {
            this.groupByDate(this.groupByDateOption)
          } else {
            this.lineChartData.datasets[0].data = this.var1_dataset;
            this.lineChartData.labels = this.var1_labels;
          }
          this.eventData.emit({
            lineChartData: this.lineChartData,
            lineChartOptions: this.lineChartOptions
          });
        }
      }
    })
    //Polling
    //Limpiamos el intervalo 
    if (this.idInterval) {
      clearInterval(this.idInterval);
    }
    this.idInterval = setInterval(() => {
      this.varsService.getModbusVarById(idmodbusvar).subscribe((modbusVar) => {
        if (modbusVar.length > 0) {
          const value: number = modbusVar[0].value[0];
          if (value && typeof value == 'number') {
            if (this.var1_dataset.length + 1 > this.muestreo) {
              const restarCount = (this.var1_dataset.length + 1) - (this.muestreo + 1);
              this.var1_dataset.splice(0, restarCount);
              this.var1_labels.splice(0, restarCount);
            }
            const date = new Date();
            const dateNow = date.toLocaleString().replace(",", "").replaceAll("/", "-");
            this.var1_dataset.push(value);
            this.var1_labels.push(this.parsearFecha(dateNow));
            this.copyDataBlobData.push(value);
            this.copyDateBlobData.push(this.parsearFecha(dateNow));
            if (this.groupByDateOption > 0) {
              this.groupByDate(this.groupByDateOption)
            } else {
              this.lineChartData.datasets[0].data = this.var1_dataset;
              this.lineChartData.labels = this.var1_labels;
            }
            this.eventData.emit({
              lineChartData: this.lineChartData,
              lineChartOptions: this.lineChartOptions
            });
          }
        }

      })
    }, time < 1000 ? 1000 : time)
  }


  private idInterval!: NodeJS.Timeout;

  pollingQueryJSON(jsonVar: IJsonVariable, time: number) {
    this.jsonBuilder.doQuery(jsonVar)
      .then((value) => {
        const date = new Date();
        const dateNow = date.toLocaleString().replace(",", "").replaceAll("/", "-");

        if (this.var1_dataset.length + 1 > this.muestreo) {
          const restarCount = (this.var1_dataset.length + 1) - (this.muestreo);
          const restarCountLabel = (this.var1_labels.length + 1) - (this.muestreo);
          this.var1_dataset.splice(0, restarCount);
          this.var1_labels.splice(0, restarCountLabel);
        }
        this.var1_dataset.push(parseFloat(value as string));
        this.var1_labels.push(this.parsearFecha(dateNow));
        this.copyDataBlobData.push(parseFloat(value as string));
        this.copyDateBlobData.push(this.parsearFecha(dateNow));
        if (this.groupByDateOption > 0) {
          this.groupByDate(this.groupByDateOption)
        } else {
          this.lineChartData.datasets[0].data = this.var1_dataset;
          this.lineChartData.labels = this.var1_labels;
        }
        this.eventData.emit({
          lineChartData: this.lineChartData,
          lineChartOptions: this.lineChartOptions
        });
      })
      .catch((err) => {
        console.log("Error al realizar la peticion: ", err)
      })

    //Limpiamos el intervalo 
    if (this.idInterval) {
      clearInterval(this.idInterval);
    }

    //Iniciamos el intervalo
    this.idInterval = setInterval(() => {
      this.jsonBuilder.doQuery(jsonVar)
        .then((value) => {
          const date = new Date();
          const dateNow = date.toLocaleString().replace(",", "").replaceAll("/", "-");

          if (this.var1_dataset.length + 1 > this.muestreo) {
            const restarCount = (this.var1_dataset.length) - (this.muestreo);
            this.var1_dataset.splice(0, restarCount);
            this.var1_labels.splice(0, restarCount);
          }
          this.var1_dataset.push(parseFloat(value as string));
          this.var1_labels.push(this.parsearFecha(dateNow));
          console.log("before error: ", value);
          if(this.copyDataBlobData)
          this.copyDataBlobData.push(parseFloat(value as string));
          if(this.copyDateBlobData)
          this.copyDateBlobData.push(this.parsearFecha(dateNow));
          if (this.groupByDateOption > 0) {
            this.groupByDate(this.groupByDateOption)
          } else {
            this.lineChartData.datasets[0].data = this.var1_dataset;
            this.lineChartData.labels = this.var1_labels;
          }
          this.eventData.emit({
            lineChartData: this.lineChartData,
            lineChartOptions: this.lineChartOptions
          });
        })
        .catch((err) => {
          console.log("Error al realizar la peticion: ", err)
        })
    }, time < 1000 ? 1000 : time);
  }
}