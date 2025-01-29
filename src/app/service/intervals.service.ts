import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntervalsService {
  private arr_intervals: NodeJS.Timeout[] = [];
  constructor() { }

  addInterval(interval: NodeJS.Timeout){
    console.log("Añadiendo un intervalo")
    this.arr_intervals.push(interval)
    console.log(this.arr_intervals);
  }

  clearAllIntervals(){
    console.log("Borrando los intervalos")
    while(this.arr_intervals.length != 0){
      clearTimeout(this.arr_intervals.pop()); 
    }
    this.arr_intervals = [];
    while(this.arr_intervals.length != 0){
      clearTimeout(this.arr_intervals.pop()); 
    }
    console.log(this.arr_intervals)
  }
}
