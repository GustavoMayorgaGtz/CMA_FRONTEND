import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDashboardGet } from 'src/app/interfaces/DasboardInterface/dashboard.interface';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ExitService } from 'src/app/service/exit.service';
import { SignalService } from 'src/app/service/signal_websocket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.component.mobile.scss']
})
export class DashboardComponent implements OnInit {
  public menu_tool: number = 0;

  set set_menu_tool(option: number) {
    this.menu_tool = option;
  }

  constructor(
    private exitService: ExitService,
    private signalsService: SignalService,
    private router: Router,
    private dashboardService: DashboardService


  ) { }


  public selectedDashboard!: number|undefined;
  selectDashboard(id_dashboard: number) {
    this.set_menu_tool = 1;
    this.selectedDashboard = id_dashboard;
  }


  public linear1: any;
  public dashboards: IDashboardGet[] = [];

  ngOnInit(): void {
    this.exitService.exitConfigurationGraphLine.subscribe(() => {
      this.set_menu_tool = 0;
    })
    const idUser = sessionStorage.getItem("idUser");
    const token = sessionStorage.getItem("token");

    if (idUser && token) {
      this.dashboardService.getDashboardsUser(parseInt(idUser), token).subscribe((data) => {
        this.dashboards = data;
      }, (err: HttpErrorResponse) => {
        console.log(err)
      })

    } else {
      this.router.navigate(['/'])
    }

  }

  private stateToolsMenu: boolean = false;
  hiddenTools(menuElement: HTMLDivElement) {
    if (this.stateToolsMenu) {
      menuElement.setAttribute("class", `menu-hidden`);
      this.stateToolsMenu = false;
    } else {
      menuElement.setAttribute("class", `menu-content`);
      this.stateToolsMenu = true;
    }
  }
}
