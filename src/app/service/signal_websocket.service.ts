import { EventEmitter, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { ws_server } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SignalService {

  produccionActual_EvEmi: EventEmitter<string> = new EventEmitter();
  alertaTime: EventEmitter<string> = new EventEmitter();

  socket = io(ws_server);
  constructor() {
     console.log("Constructor de servicio")

    
    //creando conexion a websocket
    // // Función para reconectarse automáticamente después de un tiempo de espera
    // const reconnectSocket = () => {
    //   setTimeout(connectSocket, 2000); // Intentar reconectar después de 2 segundos (puedes ajustar este valor según tus necesidades)
    // };
    // //Funcion de desconexion a websocket, nos manda a la reconexion
    // this.socket.on('disconnect', () => {
    //   reconnectSocket();
    // });
  }

  //____________________________________________________________________________________________
  // ProduccionTotal(id: number) {
  //   this.socket = io(ws_server);
  //   // this.socket.on(`Produccion_Actual_S${id}`, (data: string) => {
  //   //   this.produccionActual_EvEmi.emit(data)
  //   // });
  //   this.socket.emit('joinGroup', { group: 'esp32device' }); // Unirse al grupo

  // }
  // //____________________________________________________________________________________________

  // //____________________________________________________________________________________________
  // DejarGrupo(id: number) {
  //   console.log("Dejando el grupo de la selladora ", id);
  //   this.socket.emit('leaveGroup', { group: `monitoring` }); // Dejar el grupo
  //   this.socket.emit('leaveGroup', { group: `alert` }); // Dejar el grupo
  //   this.socket.disconnect();
  //   this.socket.close();
  // }
  // //____________________________________________________________________________________________

  //____________________________________________________________________________________________
  Alerta_TiempoParo(id: number) {
    console.log("Dato")
   
    this.socket.emit('joinGroup', { group: 'esp32device' }); // Unirse al grupo
    this.socket.on(`esp32device`, (data: string) => {
      console.log("x: ",data)
      this.alertaTime.emit(data);
    });
  }
  //____________________________________________________________________________________________
  Mandar(id: number) {
    this.socket.emit('joinGroup', { group: 'esp32device' }); // Unirse al grupo
    this.socket.emit('sendMessageToGroup', {groupName: 'esp32device', message: `Hola esp32` }); 
  }
}
