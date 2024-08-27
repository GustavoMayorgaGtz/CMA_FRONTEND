
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth_class } from 'src/app/graphs_class/auth_class';
import { ICreate_Camera } from 'src/app/interfaces/CameraInterfaces/camera.interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { CameraService } from 'src/app/service/camera_service';
import { ExitService } from 'src/app/service/exit.service';

@Component({
  selector: 'app-configure-camera',
  templateUrl: './configure-camera.component.html',
  styleUrls: ['./configure-camera.component.scss']
})

export class ConfigureCaneraComponent implements OnInit {
  @Input() id_dashboard_selected!: number | undefined;
  public show_save_button: boolean = true;

  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   TITLE
  private camera_title: string = "CAMERA A";
  public get get_camera_title() {
    return this.camera_title;
  }
  public set set_camera_title(title: string) {
    this.camera_title = title;
  }
  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   DESCRIPTION
  private camera_description: string = "Camara del sector A";
  public get get_camera_description() {
    return this.camera_description;
  }
  public set set_camera_description(description: string) {
    this.camera_description = description;
  }
  /*-----*/
  public authClass = new auth_class(this.router, this.authService, this.alertService);

  constructor(
    private alertService: AlertService,
    private exitService: ExitService,
    private router: Router,
    private cameraService: CameraService,
    private authService: AuthService) {
    this.authClass.validateUser();
  }



  ngOnInit(): void { }



  createCamera() {
    //Validaciones
    this.show_save_button = false;
    if (!this.id_dashboard_selected) {
      this.show_save_button = true;
      this.alertService.setMessageAlert("Ocurrio algun error al seleccionar el dashboard.")
    } else {
        //Obtener el id del usuario
        this.authClass.validateUser();
        const idUser = sessionStorage.getItem("idUser")
        const token = sessionStorage.getItem("token")
        if (idUser) {
          //Crear objeto
          let object: ICreate_Camera = {
            title: this.get_camera_title,
            description: this.get_camera_description,
            dashboard: this.id_dashboard_selected,
            primary_user: parseInt(idUser)
          }
          this.cameraService.create_camera(object).subscribe((response) => {
            this.alertService.setMessageAlert("Se creo la camara correctamente.");
            this.show_save_button = true;
            window.location.reload();
          }, (err: HttpErrorResponse) => {
            this.alertService.setMessageAlert("No se creo la camara correctamente, vuelve a intentarlo mas tarde.");
          })
        } else {
          this.alertService.setMessageAlert("Vuelve a iniciar sesion...")
          this.router.navigate(['/login']);
        }
    }
  }


  /**
  * Funcion para regresar al menu principal y salir del modo configuracion
  */
  return() {
    this.exitService.setExitConfigurationGraphLine();
  }
}
