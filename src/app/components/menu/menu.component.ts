import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { auth_class } from 'src/app/graphs_class/auth_class';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { finalizeService } from 'src/app/service/finalize.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss', './menu.component.mobile.scss']
})
export class MenuComponent {
  @Output() option: EventEmitter<number> = new EventEmitter();

  public watch_variables: boolean = false;
  public alerts: boolean = false;

  public authClass = new auth_class(this.router, this.authService, this.alertService);
  constructor(private finalizeService: finalizeService,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
  ) {
    this.authClass.validateUser();
    this.authService.permission('watch_variables').subscribe((watch_variables_response) => {
      this.watch_variables = watch_variables_response.access;
    }, (err) => {
      console.log("Watch variable response error")
      console.log(err);
    })
    //////////////////////
    this.authService.permission('alerts').subscribe((alerts_response) => {
      this.alerts = alerts_response.access;
    }, (err) => {
      console.log("alerts response error")
      console.log(err);
    })
  }



  change_option_event(option: number) {
    if (option == 6) {
      localStorage.removeItem("pwd");
      localStorage.removeItem("usrname");
      localStorage.removeItem("idUser");
      localStorage.removeItem("token");
      localStorage.removeItem("menu_number");
      sessionStorage.removeItem("idUser");
      sessionStorage.removeItem("token");
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
    } else {
      this.finalizeService.finalizeAllPolling_Event();
      this.option.emit(option);
      console.log("CALL 1")
      this.authClass.validateUser();

    }
  }
}
