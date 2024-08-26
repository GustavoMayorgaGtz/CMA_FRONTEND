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

  groupName(groupName: string) {
    this.socket.emit('joinGroup', { groupName }); // Unirse al grupo
    console.log(groupName)
    this.socket.on(groupName, (data: string) => {
      this.dataRecive.emit(data);
    });
  }
}
