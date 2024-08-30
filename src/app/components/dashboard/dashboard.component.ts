import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDashboardGet } from 'src/app/interfaces/DasboardInterface/dashboard.interface';
import { AlertService } from 'src/app/service/alert.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ExitService } from 'src/app/service/exit.service';
import { SignalService } from 'src/app/service/signal_websocket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.component.mobile.scss']
})
export class DashboardComponent implements OnInit {
  public menu_tool: number = 2;

  set set_menu_tool(option: number) {
    this.menu_tool = option;
  }

  constructor(
    private exitService: ExitService,
    private signalsService: SignalService,
    private router: Router,
    private dashboardService: DashboardService,
    private alertService: AlertService) { }



  /**
   * Funcion para crear dashboard
   */
  public viewCreateDashboardButton: boolean = true;
  createDashboard(title: HTMLInputElement, description: HTMLInputElement) {
    const idUser = sessionStorage.getItem("idUser");
    const token = sessionStorage.getItem("token");

    if (idUser && parseInt(idUser) >= 0 && token) {
      if (title.value) {
        if (description.value) {
          this.viewCreateDashboardButton = false;
          this.dashboardService.createDashboardUser(title.value, description.value, parseInt(idUser), token).subscribe((data) => {
            this.dashboards = data;
            this.alertService.setMessageAlert("Dashboard creado correctamente.");
            setTimeout(() => {
              this.menu_tool = 0;
            }, 2000);
          }, (err: HttpErrorResponse) => {
            this.viewCreateDashboardButton = true;
            this.alertService.setMessageAlert("No se pudo crear correctamente el dashboard");
            console.log(err)
          })
        } else {
          const style = description.style;
          this.alertService.setMessageAlert("No definiste correctamente la descripción");
          description.setAttribute("style", "border: 2px solid red;");
          setTimeout(() => {
            description.setAttribute("style", "" + style);
          }, 2000);
        }
      } else {
        const style = title.style;
        this.alertService.setMessageAlert("No definiste correctamente la descripción");
        title.setAttribute("style", "border: 2px solid red;");
        setTimeout(() => {
          title.setAttribute("style", "" + style);
        }, 2000);

      }

    } else {
      this.router.navigate(['/'])
    }
  }


  public selectedDashboard!: number | undefined;
  selectDashboard(id_dashboard: number) {
    this.set_menu_tool = 1;
    this.selectedDashboard = id_dashboard;
  }


  public linear1: any;
  public dashboards: IDashboardGet[] = [];
  public src: string = "";
  ngOnInit(): void {
    this.exitService.exitConfigurationGraphLine.subscribe(() => {
      this.set_menu_tool = 0;
    })
    const idUser = sessionStorage.getItem("idUser");
    const token = sessionStorage.getItem("token");


    this.signalsService.groupName("streaming");
    this.signalsService.dataRecive.subscribe((buffer) => {
      const blob = new Blob([buffer.data], { type: 'image/jpeg' });
      this.src = URL.createObjectURL(blob);
    })
    
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
