import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { connect } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ICamera_Recive } from 'src/app/interfaces/CameraInterfaces/camera.interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { CameraService } from 'src/app/service/camera_service';
import { ws_server } from 'src/environments/environment';

@Component({
  selector: 'app-camera_view',
  templateUrl: './camera_view.component.html',
  styleUrls: ['./camera_view.component.scss']
})
export class CameraViewComponent implements OnInit, OnChanges {
  @Input() id_camera!: number;
  title: string = "";
  description: string = "";
  dashboard!: number;
  groupName: string = "";


  constructor(private cameraService: CameraService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
   
  }


  public streaming_data: string = "";
  public status: boolean = false;
  TriggerConnectSocket() {
    if (this.socket) {
      if (this.socket.disconnected == true) {

        this.Connect_Socket().then(() => {
          //El socket funciono correctamente
          this.listenStreaming(this.indicator_saved);
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

  listenStreaming(list: ICamera_Recive) {
    this.Connect_Socket().then((connection) => {
      console.log(connection)
      console.log("UNIENDO A GRUPO: ", list.groupname)
      this.socket.emit('joinGroup', { group: list.groupname }); // Unirse al grupo
      this.socket.on(list.groupname, (data) => {
        console.log("Datos recibidos", data)
        const blob_data = new Blob([data])
        const buffer_blob = URL.createObjectURL(blob_data);
        this.streaming_data = buffer_blob;
      });

      this.socket.on("disconnect", (err) => {
        console.log(err)
        this.alertService.setMessageAlert("Desconectado de streaming");
        this.status = false;
        if (this.intentosReconexion < 3) {
          this.TriggerConnectSocket();
          this.intentosReconexion++;
        }
      })
    }).catch((err) => {
      console.log(err);
      console.log("No se pudo conectar el socket")
    })
  }

  public indicator_saved!: ICamera_Recive;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const idUserString = sessionStorage.getItem("idUser");
      if (idUserString) {
        this.cameraService.getOne(parseInt(idUserString), this.id_camera).subscribe((data) => {
          this.indicator_saved = data;
          console.log("Obteniendo todooo");
          this.Connect_Socket().then(() => {
            console.log("Ahi vieneeeee")
            this.listenStreaming(data);
          })
          .catch((err) =>{
            console.log(err);
          })
          const actualCamera = data;
          this.title = actualCamera.title;
          this.description = actualCamera.description;
          this.dashboard = actualCamera.dashboard;
          this.groupName = actualCamera.groupname;
        }, (err: HttpErrorResponse) => {
          this.alertService.setMessageAlert("No se pudo obtener el indicador, intentalo mas tarde." + err.message);
        })
      }
    }
  }
}
