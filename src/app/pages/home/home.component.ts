import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignalService } from 'src/app/service/signal_websocket.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './home.component.mobile.scss']
})

export class HomeComponent implements OnInit{
  constructor(private signalService: SignalService, private router: Router){
    const idUser = localStorage.getItem("idUser");
    const token = localStorage.getItem("token");
    const pwd = localStorage.getItem("pwd");
    if(idUser && token && pwd){
       sessionStorage.setItem("idUser", idUser);
       sessionStorage.setItem("token", token)
    }
    const saved_option = localStorage.getItem("menu_number");
    if(saved_option){
      this.optionEnable = parseInt(saved_option);
    }else{
      this.optionEnable = 3;
    }
  }

  ngOnInit(): void {
    
  }

  
  public optionEnable: number = 7;
  /**
   * Funcion para cambiar la vista del menu
   */
  setOptionEnable(opcion: number){
    localStorage.setItem("menu_number", opcion.toString())
    this.optionEnable = opcion;
  }
}
