import { EventEmitter, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { ws_server } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SignalService {

  dataRecive: EventEmitter<any> = new EventEmitter();

  socket = io(ws_server);
  constructor() {
  }

  groupName(groupname: string) {
    this.socket.emit('joinGroup', { groupName: groupname }); // Unirse al grupo
    console.log(groupname)
    this.socket.on(groupname, (data: string) => {
      console.log("valor recibido: ",data)
      this.dataRecive.emit(data);
    });
  }
}
