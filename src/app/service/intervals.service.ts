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
    this.arr_intervals.forEach((interval, idx) => {
      clearTimeout(interval);
    })
    this.arr_intervals = [];
    console.log(this.arr_intervals)
  }
}
