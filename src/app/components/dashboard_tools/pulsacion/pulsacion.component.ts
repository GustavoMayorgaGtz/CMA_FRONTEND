import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { io, Socket } from 'socket.io-client';
import { IPulsacion_Recive } from 'src/app/interfaces/PulsacionInterfaces/pulsacion.interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { PulsacionService } from 'src/app/service/pulsacion.service';
import { ws_server } from 'src/environments/environment';

@Component({
  selector: 'app-pulsacion',
  templateUrl: './pulsacion.component.html',
  styleUrls: ['./pulsacion.component.scss']
})
export class PulsacionComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() id_pulsacion!: number;
  title: string = "";
  description: string = "";
  dashboard!: number;
  groupName: string = "";

  @ViewChild("button") buttonRef!: ElementRef<HTMLDivElement>;
  private button!: HTMLDivElement;

  constructor(private pulsacionService: PulsacionService,
    private alertService: AlertService
  ) { }

  ngAfterViewInit(): void {
    if (this.buttonRef && this.buttonRef.nativeElement) {
      this.button = this.buttonRef.nativeElement;
    }
  }

  ngOnInit(): void {

  }

  public style_button: number = 0;
  setStyle_Button(style_input: string, button: HTMLDivElement) {
    // if (style_input === 'circle' || style_input === 'normal') {
    this.style_button = parseInt(style_input);
    this.setChangesButton(button);
    // }
  }

  public text_color: string = "#000000";
  setText_Color(color: string, buttonInput: HTMLDivElement) {
    this.text_color = color;
    this.setChangesButton(buttonInput);
  }



  private fill_color: string = "#5d7794";
  setFill_Color(color: string, buttonInput: HTMLDivElement) {
    this.fill_color = color;
    this.setChangesButton(buttonInput);
  }


  setChangesButton(button: HTMLDivElement) {
    const style = `
    color: ${this.text_color};
    background-color: ${this.fill_color};
    border-radius: ${this.style_button}%;
    font-weight: ${this.isSaveBlobData ? 'bold;' : 'normal;'}
    `;
    button.setAttribute("style", style);
    return {};
  }

  private isSaveBlobData: boolean = false;
  set_isSaveBlobData(value: boolean, button: HTMLDivElement) {
    this.isSaveBlobData = value;
    this.setChangesButton(button)
  }

  setFillColor() {
    return { fill: this.text_color }
  }

  public isIcon: string = "null";
  setIcon(icon: string, buttonInput: HTMLDivElement) {
    this.isIcon = icon;
    console.log(icon);
    this.setChangesButton(buttonInput);
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

  listenStreaming(list: IPulsacion_Recive) {
    this.Connect_Socket().then(() => {
      this.socket.emit('joinGroup', { groupName: list.groupname }); // Unirse al grupo
      this.socket.on(list.groupname, (data: ArrayBuffer) => {
        const blob_data = new Blob([data])
        const buffer_blob = URL.createObjectURL(blob_data);
        this.streaming_data = buffer_blob;
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

  public indicator_saved!: IPulsacion_Recive;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const idUserString = sessionStorage.getItem("idUser");
      if (idUserString) {
        this.pulsacionService.getOne(parseInt(idUserString), this.id_pulsacion).subscribe((data) => {
          this.indicator_saved = data;
          this.style_button = data.border_radius;
          this.text_color = data.text_color;
          this.fill_color = data.fill_color;
          this.isSaveBlobData = data.bold;

          this.setChangesButton(this.button)


          console.log(data);
          this.Connect_Socket().then(() => {
            this.listenStreaming(data);
          })
            .catch((err) => {
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
