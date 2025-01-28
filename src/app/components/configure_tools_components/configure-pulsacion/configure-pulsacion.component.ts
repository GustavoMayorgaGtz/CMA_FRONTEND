
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth_class } from 'src/app/graphs_class/auth_class';
import { ICreate_Pulsacion } from 'src/app/interfaces/PulsacionInterfaces/pulsacion.interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { ExitService } from 'src/app/service/exit.service';
import { PulsacionService } from 'src/app/service/pulsacion.service';

@Component({
  selector: 'app-configure-pulsacion',
  templateUrl: './configure-pulsacion.component.html',
  styleUrls: ['./configure-pulsacion.component.scss']
})

export class ConfigurePulsacionComponent implements OnInit {
  @Input() id_dashboard_selected!: number | undefined;
  public show_save_button: boolean = true;

  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   TITLE
  private pulsacion_title: string = "Mantener presionado";
  public get get_pulsacion_title() {
    return this.pulsacion_title;
  }
  public set set_pulsacion_title(title: string) {
    this.pulsacion_title = title;
  }
  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   DESCRIPTION
  private pulsacion_description: string = "Controla un servomotor";
  public get get_pulsacion_description() {
    return this.pulsacion_description;
  }
  public set set_pulsacion_description(description: string) {
    this.pulsacion_description = description;
  }
  /*-----*/
  public authClass = new auth_class(this.router, this.authService, this.alertService);

  constructor(
    private alertService: AlertService,
    private exitService: ExitService,
    private router: Router,
    private pulsacionService: PulsacionService,
    private authService: AuthService) {
    this.authClass.validateUser();
  }

  public style_button: number = 0;
  setStyle_Button(style_input: string, button: HTMLDivElement) {
    // if (style_input === 'circle' || style_input === 'normal') {
      this.style_button = parseInt(style_input);
      this.setChangesButton(button);
    // }
  }

  public text_color: string = "#000000";
  setText_Color(color: string, buttonInput: HTMLDivElement) {
    this.text_color = color;
    this.setChangesButton(buttonInput);
  }

  setFillColor(){
    return { fill: this.text_color}
  }

  private fill_color: string = "#5d7794";
  setFill_Color(color: string, buttonInput: HTMLDivElement) {
    this.fill_color = color;
    this.setChangesButton(buttonInput);
  }

  public isIcon: string = "null";
  setIcon(icon: string, buttonInput: HTMLDivElement) {
    this.isIcon = icon;
    this.setChangesButton(buttonInput);
  }

  setChangesButton(button: HTMLDivElement) {
      const width = button.getBoundingClientRect().width / 2;
      const style = `
      color: ${this.text_color};
      background-color: ${this.fill_color};
      border-radius: ${this.style_button}%;
      height: ${width}px;
      width: ${width}px;
      font-weight: ${this.isSaveBlobData? 'bold;':'normal;'}
      `;
      button.setAttribute("style", style);
  }


  ngOnInit(): void { }



  createPulsacion() {
    //Validaciones
    this.show_save_button = false;
    if (!this.id_dashboard_selected) {
      this.show_save_button = true;
      this.alertService.setMessageAlert("Ocurrio algun error al seleccionar el dashboard.")
    } else {
        //Obtener el id del usuario
        const idUser = sessionStorage.getItem("idUser")
        const token = sessionStorage.getItem("token")
        this.authClass.validateUser();
        if (idUser && token) {
          //Crear objeto
          let object: ICreate_Pulsacion = {
            title: this.get_pulsacion_title,
            description: this.get_pulsacion_description,
            dashboard: this.id_dashboard_selected,
            primary_user: parseInt(idUser),
            text_color: this.text_color,
            fill_color: this.fill_color,
            bold: this.isSaveBlobData,
            icon: this.isIcon,
            border_radius: this.style_button
          }
          this.pulsacionService.create_pulsacion(object, token).subscribe((response) => {
            this.alertService.setMessageAlert("Se creo el boton pulsación correctamente.");
            this.show_save_button = true;
            window.location.reload();
          }, (err: HttpErrorResponse) => {
            this.alertService.setMessageAlert("No se creo el boton pulsación correctamente, vuelve a intentarlo mas tarde.");
          })
        } else {
          this.alertService.setMessageAlert("8. Vuelve a iniciar sesion...")
          this.router.navigate(['/login']);
        }
    }
  }


  
  private isSaveBlobData: boolean = false;
  set_isSaveBlobData(value: boolean, button: HTMLDivElement) {
    this.isSaveBlobData = value;
    this.setChangesButton(button)
  }

  /**
  * Funcion para regresar al menu principal y salir del modo configuracion
  */
  return() {
    this.exitService.setExitConfigurationGraphLine(false);
  }
}
