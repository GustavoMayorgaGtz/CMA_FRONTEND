import { Component, OnInit } from '@angular/core';
import { SignalService } from 'src/app/service/signal_websocket.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './home.component.mobile.scss']
})

export class HomeComponent implements OnInit{
  constructor(private signalService: SignalService){
    const saved_option = localStorage.getItem("menu_number");
    if(saved_option){
      this.optionEnable = parseInt(saved_option);
    }else{
      this.optionEnable = 3;
    }
  }

  ngOnInit(): void {
    
  }

  
  public optionEnable: number = 3;
  /**
   * Funcion para cambiar la vista del menu
   */
  setOptionEnable(opcion: number){
    localStorage.setItem("menu_number", opcion.toString())
    this.optionEnable = opcion;
  }
}
