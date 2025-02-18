import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDashboardGet } from 'src/app/interfaces/DasboardInterface/dashboard.interface';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ExitService } from 'src/app/service/exit.service';
import { IntervalsService } from 'src/app/service/intervals.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.component.mobile.scss']
})
export class DashboardComponent implements OnInit {
  public menu_tool: number = 0;

  set set_menu_tool(option: number) {
    this.intervals_service.clearAllIntervals();
    this.menu_tool = option;
  }

  public create_tool:boolean = false;
  constructor(
    private exitService: ExitService,
    private authsevice: AuthService,
    private router: Router,
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private intervals_service: IntervalsService) { 

      this.authsevice.permission('create_tools').subscribe((response) => {
            this.create_tool = response.access;
      }, (err: HttpErrorResponse)=> {
        console.log(err);
      });
    }

  public edit_id_tool:number = 0;
  recibeToolEdit(data_edit: { type: string, id_tool: number }) {
    switch (data_edit.type) {
      case 'linechart': {
        this.edit_id_tool = data_edit.id_tool;
        this.menu_tool = 2;
        break;
      }
      case 'indicator': {
        this.menu_tool = 4;
        this.edit_id_tool = data_edit.id_tool;
        break;
      }
      case 'streaming': {
        this.menu_tool = 5;
        break;
      }
      case 'pulsacion': {
        this.menu_tool = 6;
        break;
      }
      case 'camara': {
        // this.menu_tool = 7;
        break;
      }
      case 'image': {
        this.menu_tool = 7;
        this.edit_id_tool = data_edit.id_tool;
        break;
      }
    }
  }

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
            this.getDashboard();
            setTimeout(() => {
              this.viewCreateDashboardButton = true;
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
  public name_dashboard: string = "";
  selectDashboard(id_dashboard: number, name_dashboard: string) {
    this.set_menu_tool = 1;
    this.selectedDashboard = id_dashboard;
    this.name_dashboard = name_dashboard;
    sessionStorage.setItem("id_dashboard", "" + id_dashboard);
    sessionStorage.setItem("name_dashboard", name_dashboard);
  }


  public linear1: any;
  public dashboards: IDashboardGet[] = [];
  public src: string = "";
  ngOnInit(): void {
    this.exitService.exitConfigurationGraphLine.subscribe((option) => {
      if (option) {
        sessionStorage.setItem("id_dashboard", "0");
        sessionStorage.setItem("name_dashboard", "");
        this.set_menu_tool = 0;
        this.intervals_service.clearAllIntervals();
      } else {
        this.set_menu_tool = 1;
        let id_dashboard = sessionStorage.getItem("id_dashboard");
        let name_dashboard = sessionStorage.getItem("name_dashboard");
        this.intervals_service.clearAllIntervals();
        if (id_dashboard && name_dashboard) {
          this.selectedDashboard = parseInt(id_dashboard);
          this.name_dashboard = name_dashboard;
        }
      }
    })

    let id_dashboard = sessionStorage.getItem("id_dashboard");
    let name_dashboard = sessionStorage.getItem("name_dashboard");

    if (id_dashboard && name_dashboard) {
      this.set_menu_tool = 1;
      this.selectedDashboard = parseInt(id_dashboard);
      this.name_dashboard = name_dashboard;
    }
    // this.signalsService.groupName("streaming");
    // this.signalsService.dataRecive.subscribe((buffer) => {
    //   const blob = new Blob([buffer.data], { type: 'image/jpeg' });
    //   this.src = URL.createObjectURL(blob);
    // })

    this.getDashboard();

  }



  getDashboard() {
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
    this.edit_id_tool = 0;
    if (this.stateToolsMenu) {
      menuElement.setAttribute("class", `menu-hidden`);
      this.stateToolsMenu = false;
    } else {
      menuElement.setAttribute("class", `menu-content`);
      this.stateToolsMenu = true;
    }
  }
}
