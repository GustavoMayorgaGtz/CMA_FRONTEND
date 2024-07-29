import { Component, OnInit } from '@angular/core';
import { ExitService } from 'src/app/service/exit.service';
import { SignalService } from 'src/app/service/signal_websocket.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.component.mobile.scss']
})
export class DashboardComponent implements OnInit {
  public menu_tool: number = 1;

  set set_menu_tool(option: number) {
    this.menu_tool = option;
  }

  constructor(
    private exitService: ExitService,
  private signalsService: SignalService) {
    // this.signalsService.ProduccionTotal(3);
  }

  public linear1: any;
  ngOnInit(): void {
    this.exitService.exitConfigurationGraphLine.subscribe(() => {
      this.set_menu_tool = 1;
    })
  }

  private stateToolsMenu: boolean = false;
  hiddenTools(menuElement: HTMLDivElement){
    if(this.stateToolsMenu){
      menuElement.setAttribute("class", `menu-hidden`);
      this.stateToolsMenu = false;
    }else{
      menuElement.setAttribute("class", `menu-content`);
      this.stateToolsMenu = true;
    }
  }
}
