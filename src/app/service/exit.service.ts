import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExitService {
  public exitConfigurationGraphLine :EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  setExitConfigurationGraphLine(option: boolean){
    this.exitConfigurationGraphLine.emit(option);
  }
}
