import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { io, Socket } from 'socket.io-client';
import { IRecive_Indicator } from 'src/app/interfaces/IndicatorInterfaces/indicator_interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { IndicatorService } from 'src/app/service/indicators_service';
import { ws_server } from 'src/environments/environment';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit, OnChanges {

  @Input() id_indicator!: number;
  title: string = "";
  description: string = "";
  symbol: string = "";
  dashboard!: number;
  type_data_in: string = "";
  type_data_design: string = "";
  groupName: string = "";
  backgroundColor: string = "";


  constructor(private indicatorService: IndicatorService,
    private alertService: AlertService
  ) { }

  public data: any;
  ngOnInit(): void {

  }


  public status: boolean = false;
  TriggerConnectSocket() {
    if (this.socket) {
      if (this.socket.disconnected == true) {

        this.Connect_Socket().then(() => {
          //El socket funciono correctamente
          this.listenIndicators(this.indicator_saved);
        })
          .catch((err) => {
            this.TriggerConnectSocket();
          })
      }
    } else {
      this.Connect_Socket().then(() => {
        //El socket funciono correctamente
      })
        .catch((err) => {
          this.TriggerConnectSocket();
        })
    }
  }

  public socket!: Socket<DefaultEventsMap, DefaultEventsMap>;
  public intervalLoop !: any;
  private intentosReconexion = 0;
  Connect_Socket() {
    return new Promise((resolve, reject) => {
      //deshabilitar el actual socket
      if (this.socket) {
        this.socket.disconnect();
        this.socket.removeAllListeners();
      }

      //Tratando de conectar
      this.socket = io(ws_server, {
        reconnectionDelayMax: 10000,
        autoConnect: false,
        reconnectionDelay: 10000,
        reconnection: false
      });

      this.socket.connect();

      //Mandar a repetir el intento de conexion a los 10000 segundos
      let interval = setTimeout(() => {
        this.socket.disconnect();
        this.socket.removeAllListeners();
        reject("No conecto")
      }, 10000)

      //Validar la conexion
      this.socket.on("connect", () => {
        this.status = true;
        clearInterval(interval);
        this.intentosReconexion = 0;
        resolve("Conecto")
      })
    })
  }

  listenIndicators(list: IRecive_Indicator) {
    this.Connect_Socket().then((connection) => {
      this.socket.emit('joinGroup', {
        group: list.groupname
      }); // Unirse al grupo
      this.socket.on(list.groupname, (data: string) => {
        console.log(data)
        this.data = data;
      });
      this.socket.on("disconnect", () => {
        this.status = false;
        console.log("Se desconecto la conexion")
        if (this.intentosReconexion < 3) {
          this.TriggerConnectSocket();
          this.intentosReconexion++;
        }
      })

    }).catch((err) => {
      console.log("No se pudo conectar el socket")
    })
  }

  public indicator_saved!: IRecive_Indicator;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const idUserString = sessionStorage.getItem("idUser");
      if (idUserString) {
        this.indicatorService.getOne(parseInt(idUserString), this.id_indicator).subscribe((data) => {
          this.indicator_saved = data;
          this.Connect_Socket().then(() => {
            this.listenIndicators(data);
          })
            .catch((err) => {
              console.log(err);
            })
          const actualIndicator = data;
          this.title = actualIndicator.title;
          this.description = actualIndicator.description;
          this.symbol = actualIndicator.symbol;
          this.dashboard = actualIndicator.dashboard;
          this.type_data_in = actualIndicator.type_data_in;
          this.type_data_design = actualIndicator.type_data_design;
          this.groupName = actualIndicator.groupname;

          switch (this.type_data_design) {
            case 'light': {
              this.backgroundColor = "#F0E47A"
              break;
            }
            case 'motor': {
              this.backgroundColor = "rgb(240, 157, 85)"
              break;
            }
            case 'machine': {
              this.backgroundColor = "#E4F0E8"
              break;
            }
            case 'air': {
              this.backgroundColor = "#D5E8F0"
              break;
            }
            case 'temperature': {
              this.backgroundColor = "rgb(237, 108, 108)"
              break;
            }
            case 'wet': {
              this.backgroundColor = "rgb(148, 200, 254)"
              break;
            }
            case 'status': {
              this.backgroundColor = "rgb(165, 224, 116)"
              break;
            }
            case 'other': {
              this.backgroundColor = "#e9cca4"
              break;
            }
            default: {
              this.backgroundColor = "red"
              break;
            }
          }
        }, (err: HttpErrorResponse) => {
          this.alertService.setMessageAlert("No se pudo obtener el indicador, intentalo mas tarde." + err.message);
        })
      }
    }
  }
}
