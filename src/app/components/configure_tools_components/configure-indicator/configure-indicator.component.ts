
import { Component, OnInit } from '@angular/core';
import { ICreate_Indicator } from 'src/app/interfaces/IndicatorInterfaces/indicator_interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { ExitService } from 'src/app/service/exit.service';

@Component({
  selector: 'app-configure-indicator',
  templateUrl: './configure-indicator.component.html',
  styleUrls: ['./configure-indicator.component.scss']
})

export class ConfigureIndicatorComponent implements OnInit {

  
  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   TITLE
  private indicator_title: string = "";
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
  private indicator_type_data_in: string = "";
  public get get_indicator_type_data_in() {
    return this.indicator_type_data_in;
  }
  public set set_indicator_type_data_in(type_data_in: string) {
    this.indicator_type_data_in = type_data_in;
  }
  /*-----*/
  //-   -   -   -   -   -   -   -   -   -   TYPE DATA DESIGN
  private indicator_type_data_design: string = "";
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




  constructor(
    private alertService: AlertService,
    private exitService: ExitService) {
  }



  ngOnInit(): void { }



  createIndicator() {
    //Validaciones
    if (!this.get_indicator_title) {
      this.alertService.setMessageAlert("No haz definido correctamente el titulo del indicador.")
    } else {
      if (!this.get_indicator_description) {
        this.alertService.setMessageAlert("No haz definido correctamente la descripcion del indicador.")
      } else {
        if (!this.get_indicator_symbol) {
          this.alertService.setMessageAlert("No haz definido correctamente el simbolo del indicador.")
        } else {
          if (!this.get_indicator_type_data_in) {
            this.alertService.setMessageAlert("No haz definido correctamente el tipo de entrada del indicador.")
          } else {
            if (!this.get_indicator_type_data_design) {
              this.alertService.setMessageAlert("No haz definido correctamente el diseño orientado al indicador.")
            } else {
              //Crear objeto
              let object: ICreate_Indicator = {
                title: this.get_indicator_title,
                description: this.get_indicator_description,
                symbol: this.get_indicator_symbol,
                type_data_in: "",
                type_data_design: "",
                dashboard: 0,
                issaveblobdata: true

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
    this.exitService.setExitConfigurationGraphLine();
  }
}
