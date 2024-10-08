
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth_class } from 'src/app/graphs_class/auth_class';
import { ICreate_Indicator } from 'src/app/interfaces/IndicatorInterfaces/indicator_interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { ExitService } from 'src/app/service/exit.service';
import { IndicatorService } from 'src/app/service/indicators_service';

@Component({
  selector: 'app-configure-indicator',
  templateUrl: './configure-indicator.component.html',
  styleUrls: ['./configure-indicator.component.scss']
})

export class ConfigureIndicatorComponent implements OnInit {
  @Input() id_dashboard_selected!: number|undefined;
  public show_save_button: boolean = true;

  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   TITLE
  private indicator_title: string = "TEMP OFI";
  public get get_indicator_title() {
    return this.indicator_title;
  }
  public set set_indicator_title(title: string) {
    this.indicator_title = title;
  }
  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   DESCRIPTION
  private indicator_description: string = "";
  public get get_indicator_description() {
    return this.indicator_description;
  }
  public set set_indicator_description(description: string) {
    this.indicator_description = description;
  }
  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   SYMBOL  
  private indicator_symbol: string = "";
  public get get_indicator_symbol() {
    return this.indicator_symbol;
  }
  public set set_indicator_symbol(symbol: string) {
    this.indicator_symbol = symbol;
  }
  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   TYPE DATA IN  
  private indicator_type_data_in: string = "boolean";
  public get get_indicator_type_data_in() {
    return this.indicator_type_data_in;
  }
  public set set_indicator_type_data_in(type_data_in: string) {
    this.indicator_type_data_in = type_data_in;
  }
  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   TYPE DATA DESIGN
  private indicator_type_data_design: string = "light";
  public get get_indicator_type_data_design() {
    return this.indicator_type_data_design;
  }
  public set set_indicator_type_data_design(type_data_design: string) {
    this.indicator_type_data_design = type_data_design;
  }
  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   SAVE IN BLOBDATA
  private indicator_blobdata: boolean = false;
  public get get_indicator_blobdata() {
    return this.indicator_blobdata;
  }
  public set set_indicator_blobdata(blobdata: boolean) {
    this.indicator_blobdata = blobdata;
  }
  /*-----*/


  public authClass = new auth_class(this.router, this.authService, this.alertService);

  constructor(
    private alertService: AlertService,
    private exitService: ExitService,
    private router: Router,
    private indicatorService: IndicatorService,
    private authService: AuthService) {
    this.authClass.validateUser();
  }



  ngOnInit(): void { }



  createIndicator() {
    //Validaciones
    this.show_save_button = false;
    if(!this.id_dashboard_selected){
      this.show_save_button = true;
      this.alertService.setMessageAlert("Ocurrio algun error al seleccionar el dashboard.")
    }else{
      if (!this.get_indicator_title) {
        this.show_save_button = true;
        this.alertService.setMessageAlert("No haz definido correctamente el titulo del indicador.")
      } else {
        if (!this.get_indicator_description) {
          this.show_save_button = true;
          this.alertService.setMessageAlert("No haz definido correctamente la descripcion del indicador.")
        } else {
          if (!this.get_indicator_symbol) {
            this.show_save_button = true;
            this.alertService.setMessageAlert("No haz definido correctamente el simbolo del indicador.")
          } else {
            if (!this.get_indicator_type_data_in) {
              this.show_save_button = true;
              this.alertService.setMessageAlert("No haz definido correctamente el tipo de entrada del indicador.")
            } else {
              if (!this.get_indicator_type_data_design) {
                this.show_save_button = true;
                this.alertService.setMessageAlert("No haz definido correctamente el diseño orientado al indicador.")
              } else {
                //Obtener el id del usuario
                this.authClass.validateUser();
                const idUser = sessionStorage.getItem("idUser")
                const token = sessionStorage.getItem("token")
                if (idUser) {
                  //Crear objeto
                  let object: ICreate_Indicator = {
                    title: this.get_indicator_title,
                    description: this.get_indicator_description,
                    symbol: this.get_indicator_symbol,
                    type_data_in: this.get_indicator_type_data_in,
                    type_data_design: this.get_indicator_type_data_design,
                    dashboard: this.id_dashboard_selected,
                    issaveblobdata: true,
                    primary_user: parseInt(idUser)
                  }
                  this.indicatorService.create_indicator(object).subscribe((response) => {
                    this.alertService.setMessageAlert("Se creo el indicador correctamente.");
                    this.show_save_button = true;
                    window.location.reload();
                  }, (err: HttpErrorResponse) => {
                    this.alertService.setMessageAlert("No se creo el indicador correctamente, vuelve a intentarlo mas tarde.");
                  })
                } else {
                  this.alertService.setMessageAlert("Vuelve a iniciar sesion...")
                  this.router.navigate(['/login']);
                }
  
              }
            }
          }
        }
      }
    }
  



  }


  /**
  * Funcion para regresar al menu principal y salir del modo configuracion
  */
  return() {
    this.exitService.setExitConfigurationGraphLine(false);
  }
}
