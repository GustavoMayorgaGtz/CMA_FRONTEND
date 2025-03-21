import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IConfigurationShadow } from 'src/app/interfaces/TieldmapInterfaces/tieldmapinterfaces';
import { AlertService } from 'src/app/service/alert.service';
import { CameraService } from 'src/app/service/camera_service';
import { finalizeService } from 'src/app/service/finalize.service';
import { IndicatorService } from 'src/app/service/indicators_service';
import { LineChartService } from 'src/app/service/linechart_service';
import { PulsacionService } from 'src/app/service/pulsacion.service';
import { SimpleButtonService } from 'src/app/service/simple_button_service';

@Component({
  selector: 'app-tieldmap',
  templateUrl: './tieldmap.component.html',
  styleUrls: ['./tieldmap.component.scss', './tieldmap.component.mobile.scss']
})
export class TieldmapComponent implements OnChanges {

  @ViewChildren('shadow_container') shadow_containers!: QueryList<ElementRef>;
  @ViewChild('tieldmap') tieldmap!: ElementRef<HTMLDivElement>;
  @Input() id_dashboard!: number;
  @Input() name_dashboard!: string;

  public shadow_container: IConfigurationShadow[] = []
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const idUser = sessionStorage.getItem("idUser");
      const token = sessionStorage.getItem("token");
      if (idUser && parseInt(idUser) > 0 && token && this.id_dashboard) {
        //Obtener las variables
        this.linechart_Service.getAllLineChart(token, parseInt(idUser), this.id_dashboard).subscribe((linecharts) => {
          linecharts.forEach((line_chart) => {

            this.shadow_container.push({
              name: line_chart.title,
              width: line_chart.width ? line_chart.width : 300,
              height: line_chart.height ? line_chart.height : 300,
              x: line_chart.x ? line_chart.x : 0,
              y: line_chart.y ? line_chart.y : 0,
              type: 'linechart',
              id: line_chart.idlinealchart
            })
          })
        })
        //--------
        this.simplebutton_Service.getAll_SimpleButton(token, parseInt(idUser), this.id_dashboard).subscribe((simplebuttons) => {
          simplebuttons.forEach((simplebutton) => {
            this.shadow_container.push({
              name: simplebutton.title,
              width: simplebutton.width ? simplebutton.width : 300,
              height: simplebutton.height ? simplebutton.height : 300,
              x: simplebutton.x ? simplebutton.x : 0,
              y: simplebutton.y ? simplebutton.y : 0,
              type: 'simplebutton',
              id: simplebutton.idsimplebutton
            })
          })
        })
        //--------
        this.indicators_Service.getAll_Dashboard(token, parseInt(idUser), this.id_dashboard).subscribe((response) => {
          response.forEach((data) => {
            this.shadow_container.push({
              name: data.title,
              width: data.width ? data.width : 300,
              height: data.height ? data.height : 150,
              x: data.x ? data.x : 0,
              y: data.y ? data.y : 0,
              type: 'indicator',
              id: data.id_indicator
            })

          })
        }, (err: HttpErrorResponse) => {
          console.log(err);
        })
        //-----------
        this.camera_Service.getAll_Dashboard(token, parseInt(idUser), this.id_dashboard).subscribe((response) => {
          response.forEach((data) => {
            this.shadow_container.push({
              name: data.title,
              width: data.width ? data.width : 300,
              height: data.height ? data.height : 150,
              x: data.x ? data.x : 0,
              y: data.y ? data.y : 0,
              type: 'streaming',
              id: data.id_camera
            })
          })
        }, (err: HttpErrorResponse) => {
          console.log(err);
        })
        //-----------
        this.pulsacion_Service.getAll_Dashboard(token, parseInt(idUser), this.id_dashboard).subscribe((response) => {
          response.forEach((data) => {
            this.shadow_container.push({
              name: data.title,
              width: data.width ? data.width : 300,
              height: data.height ? data.height : 150,
              x: data.x ? data.x : 0,
              y: data.y ? data.y : 0,
              type: 'pulsacion',
              id: data.id_pulsacion
            })
          })
        }, (err: HttpErrorResponse) => {
          console.log(err);
        })
      } else {
        this.router.navigate(['/'])
      }
    }
  }

  constructor(private linechart_Service: LineChartService,
    private simplebutton_Service: SimpleButtonService,
    private indicators_Service: IndicatorService,
    private camera_Service: CameraService,
    private pulsacion_Service: PulsacionService,
    private alertService: AlertService,
    private router: Router,
    private finalizeServices: finalizeService) {



  }




  /**
   * Funcion para establecer la posicion relativa del cursor y mostrar el punto de inicio del contenedor shadow
   * @param event Evento para determinar la posicion del cursor
   * @param tieldmap Contenedor para determinar la posicion relativa del cursor al contenedor padre
   * @param shadow Contenedor grafico que muestra los datos de seleccion
   */
  public init_x!: number;
  public init_y!: number;
  public isDraw: boolean = false;
  public lastBloqueWidth: number = 25;



  /**
   * Funcion que sirve para determinar los valores para los diferentes eventos de shadow
   * @param event
   * @param tieldmap
   */
  getPosition(event: MouseEvent| TouchEvent, tieldmap: HTMLDivElement) {
    // event.preventDefault();
    const tieldmap_positionX = tieldmap.getBoundingClientRect().x;
    const tieldmap_positionY = tieldmap.getBoundingClientRect().y;
    const tieldmap_width = tieldmap.getBoundingClientRect().width;
    const tieldmap_positionX_End = tieldmap_positionX + tieldmap_width;
    let positionX: number = 0;
    let positionY: number = 0;

    if (event instanceof MouseEvent) {
      // Si es un evento de mouse
      positionX = event.clientX - tieldmap_positionX;
      positionY = (event.clientY  - tieldmap_positionY) + tieldmap.scrollTop;
    } else if (event instanceof TouchEvent) {
      // Si es un evento táctil
      positionX = event.touches[0].clientX - tieldmap_positionX;
      positionY = (event.touches[0].clientY  - tieldmap_positionY) + tieldmap.scrollTop;
    }
    // const positionX = event.clientX - tieldmap_positionX;
    // const positionY = (event.clientY - tieldmap_positionY) + tieldmap.scrollTop;
    const bloque_width = parseInt((tieldmap_width / 25).toString());
    const lastBloqueWidth = (tieldmap_width / bloque_width) >= 20 ? (tieldmap_width / bloque_width) : 25;

    //Funcion para mover el shadow container
    if (this.isMove && (positionX <= tieldmap_positionX_End - 20)) {
      const y_new_position = parseInt((positionY / lastBloqueWidth).toString())
      const x_new_position = parseInt((positionX / lastBloqueWidth).toString())
      this.shadow_container[this.idShadowMove].x = x_new_position >= 0 ? x_new_position : 0;
      this.shadow_container[this.idShadowMove].y = y_new_position >= 0 ? y_new_position : 0;
    } else {

      this.isMove = false
    }

    //Funcion para alterar el size del shadow container
    if (this.shadow_container[this.idShadowResize]) {
      let tieldmap_width_last = parseInt(((positionX / lastBloqueWidth) - this.shadow_container[this.idShadowResize].x).toString()) * lastBloqueWidth;
      const position_shadow_x_end = this.shadow_container[this.idShadowMove].x + tieldmap_width_last + tieldmap.getBoundingClientRect().x;
      if (this.isResize && (position_shadow_x_end <= tieldmap_positionX_End - 10)) {
        let tieldmap_height_last = parseInt(((positionY / lastBloqueWidth) - this.shadow_container[this.idShadowResize].y).toString()) * lastBloqueWidth;
        if (parseInt(((positionX / lastBloqueWidth) - this.init_x).toString()) <= 0) {
          tieldmap_width_last = lastBloqueWidth;
        }
        if (parseInt(((positionY / lastBloqueWidth) - this.init_y).toString()) <= 0) {
          tieldmap_height_last = lastBloqueWidth;
        }
        this.shadow_container[this.idShadowResize].width = tieldmap_width_last + lastBloqueWidth;
        this.shadow_container[this.idShadowResize].height = tieldmap_height_last + lastBloqueWidth;
      } else {
        this.isResize = false;
      }
    }


  }


  setContenidoElement(contenedor: HTMLDivElement) {
    contenedor.setAttribute("style", `
      width: 100%;
      height: ${this.MAX_HEIGHT}px`)

    return {}
  }


  /**
   * Funcion que sirve para colocar las propiedades
   * @param shadow
   * @param idShadow
   * @returns
   */

  public setPositionsSizes!: Object;
  public tieldmap_bloque_width = 0;
  public temp_shadow_container: IConfigurationShadow[] = [];
  public messages: string = "";
  private last_height: number = 0;
  private MAX_HEIGHT: number = 0;
  setPropietiesShadow(shadow: HTMLDivElement, idShadow: number, tieldmap: HTMLDivElement) {
    /*Hacer validaciones
    1. Ver si la posicion x es mayor al tamaño del screen
      Si si es tiene que estar en la posicion 0
    2.- Validar si el tamaño de la posicion x + el width del contenedor es mayor al actual del tieldmap
    3._ Validar si el restante - x init del contenedor da negativo, si es asi, x = 0 y width = full
    4.- Guardar la nueva posicion
    5.- Validar si la posicion Y esta siendo usada por otro objeto y si es asi recorrer y hacer validaciones
    */

    const tieldmap_width = tieldmap.getBoundingClientRect().width;
    const bloque_width = parseInt((tieldmap_width / 25).toString());
    const lastBloqueWidth = (tieldmap_width / bloque_width) >= 20 ? (tieldmap_width / bloque_width) : 25;
    this.tieldmap_bloque_width = parseInt((tieldmap_width / lastBloqueWidth).toString());
    const shadow_container = this.shadow_container[idShadow];
    const shadow_container_x = this.shadow_container[idShadow].x * this.lastBloqueWidth;
    const shadow_container_x_end = shadow_container.x * this.lastBloqueWidth + shadow_container.width;
    const tieldmap_x_end = tieldmap.getBoundingClientRect().x + tieldmap.getBoundingClientRect().width;


    //validacion 5
    if (this.temp_shadow_container.length > 0) {

      /**
      * Validaciones dentro de la validacion 5
      * Eliminar la superposicion de los contenedores
      * Agarrar el contenedor actual y validar cada uno de los contenedores temporeales
      */
      this.validacion_overarea(shadow_container, idShadow);
    }
    //Validacion 1
    if ((shadow_container.x * this.lastBloqueWidth) >= tieldmap_x_end) {
      this.shadow_container[idShadow].x = 0;
      // this.validacion_overarea(shadow_container, idShadow);
    }
    //Validacion 2 y 3
    if (shadow_container_x_end >= (tieldmap_x_end - 250)) { //TODO: Hay que checar esta validacion
      const restante = shadow_container_x_end - (tieldmap_x_end - 250); //Este restante nos sirve para restar al shadow init x
      const new_shadow_container_x_init = shadow_container_x - restante; //Esta es la nueva posicion del shadow container en el eje X hay que validar si es menor a la del tieldmap

      if (new_shadow_container_x_init <= tieldmap.getBoundingClientRect().x) {
        /**
         * Se le asigna el position x = 0 y el width de full tieldmap debido a que no cabe originalmente
         */
        this.shadow_container[idShadow].x = tieldmap.getBoundingClientRect().x;
        this.shadow_container[idShadow].width = ((this.tieldmap_bloque_width * this.lastBloqueWidth) - 25); //El valor de resta es el que hace que este mas separado del borde derecho cuando el shadow lo sobrepasa
      }
      else {
        this.shadow_container[idShadow].x = new_shadow_container_x_init; //Si cabe si le quitamos el restante a la posicion inicial de x
      }
      this.shadow_container[idShadow].x = 0;
      this.validacion_overarea(shadow_container, idShadow);
    }
    //Validacion 4
    this.temp_shadow_container.push({
      name: this.shadow_container[idShadow].name,
      width: this.shadow_container[idShadow].width,
      height: this.shadow_container[idShadow].height,
      x: this.shadow_container[idShadow].x,
      y: this.shadow_container[idShadow].y,
      type: this.shadow_container[idShadow].type,
      id: this.shadow_container[idShadow].id
    })
    if (this.last_height < this.shadow_container[idShadow].y) {
      this.last_height = this.shadow_container[idShadow].y;

      tieldmap.setAttribute("height", `
         height: ${this.last_height + 200}px;
         `);
    }


    if (this.MAX_HEIGHT < (this.shadow_container[idShadow].y * this.lastBloqueWidth) + this.shadow_container[idShadow].height) {
      this.MAX_HEIGHT = (this.shadow_container[idShadow].y * this.lastBloqueWidth) + this.shadow_container[idShadow].height;
    }

    shadow.setAttribute("style", `position: absolute;
     top: ${this.shadow_container[idShadow].y * this.lastBloqueWidth}px;
     left: ${this.shadow_container[idShadow].x * this.lastBloqueWidth}px;
      width: ${this.shadow_container[idShadow].width}px;
      height: ${this.shadow_container[idShadow].height}px;
       background-color: white;
     border: 1px solid rgba(0, 0, 0, 0.127);; border-radius: 5px;`);
  }

  validacion_overarea(shadow_container: IConfigurationShadow, idShadow: number) {
    /**
     * Validaciones dentro de la validacion 5
     * Eliminar la superposicion de los contenedores
     * Agarrar el contenedor actual y validar cada uno de los contenedores temporeales
     */
    this.temp_shadow_container.forEach((temp_shadow) => {
      //VALIDACION EXTERNA
      /**********************************************************************************************/
      //Validar si ocupamos el mismo area
      const shadow_container_x = this.shadow_container[idShadow].x * this.lastBloqueWidth;
      const shadow_container_x_end = shadow_container.x * this.lastBloqueWidth + shadow_container.width;
      const shadow_container_y = this.shadow_container[idShadow].y * this.lastBloqueWidth;
      const shadow_container_y_end = shadow_container.y * this.lastBloqueWidth + shadow_container.height;
      const y_init = temp_shadow.y * this.lastBloqueWidth;
      const y_end = temp_shadow.y * this.lastBloqueWidth + ((typeof temp_shadow.height == 'string') ? parseFloat(temp_shadow.height) : temp_shadow.height);
      const x_init = temp_shadow.x * this.lastBloqueWidth;
      const x_end = temp_shadow.x * this.lastBloqueWidth + temp_shadow.width;
      let inX = false;
      let inY = false;

      //dos validaciones para x
      if (shadow_container_x >= x_init && shadow_container_x <= x_end) {
        inX = true;
      }
      if (shadow_container_x_end >= x_init && shadow_container_x_end <= x_end) {
        inX = true;
      }
      //dos validaciones para y
      if (shadow_container_y >= y_init && shadow_container_y <= y_end) {
        inY = true;
      }
      if (shadow_container_y_end >= y_init && shadow_container_y_end <= y_end) {
        inY = true;
      }
      //Si estamos ocupando el area de otro contenedor hay que recorrer el contenedor actual
      if (inX && inY) {
        //recorrer hacia abajo
        let newPositionY = parseInt(((y_end + (this.lastBloqueWidth)) / this.lastBloqueWidth).toString());
        this.shadow_container[idShadow].y = newPositionY;
        this.validacion_overarea(shadow_container, idShadow);
      }

    })
  }



  public propiedadAplicada: number[] = [];
  setChanges(shadow: HTMLDivElement, idShadow: number, tieldmap: HTMLDivElement) {
    // console.log("Datos de la sombra: ",);
    const type = this.shadow_container[idShadow].type;
    switch (type) {
      case 'indicator': {
        shadow.setAttribute("style", `position: absolute;
        top: ${this.shadow_container[idShadow].y * this.lastBloqueWidth}px;
        left: ${this.shadow_container[idShadow].x * this.lastBloqueWidth}px;
        max-width: 300px;
        height: 70px;
        min-width: 250px;
        width: 100%;
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 5px;`);
        break;
      }
      case 'linechart': {
        shadow.setAttribute("style", `position: absolute;
        top: ${this.shadow_container[idShadow].y * this.lastBloqueWidth}px;
        left: ${this.shadow_container[idShadow].x * this.lastBloqueWidth}px;
        width: ${this.shadow_container[idShadow].width}px;
        height: ${this.shadow_container[idShadow].height}px;
        background-color: white;
        font-size: clamp(6px, 100%, 24px);
        border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 5px;`);
        break;
      }
      case 'simplebutton': {
        // const container = document.querySelector('.container');
        const fontSize = shadow.offsetWidth / 8;  // Puedes ajustar el divisor según sea necesario
        // shadow.style.fontSize = `${fontSize}px`;
        shadow.setAttribute("style", `position: absolute;
        top: ${this.shadow_container[idShadow].y * this.lastBloqueWidth}px;
        left: ${this.shadow_container[idShadow].x * this.lastBloqueWidth}px;
        width: ${this.shadow_container[idShadow].width}px;
        height: ${this.shadow_container[idShadow].height}px;

        font-size: ${fontSize}px`);
        break;
      }
      case 'streaming': {

        // const container = document.querySelector('.container');
        shadow.setAttribute("style", `position: absolute;
        top: ${this.shadow_container[idShadow].y * this.lastBloqueWidth}px;
        left: ${this.shadow_container[idShadow].x * this.lastBloqueWidth}px;
        width: ${this.shadow_container[idShadow].width}px;
        height: ${this.shadow_container[idShadow].height}px;
        overflow: hidden;
        background-color: white;
        padding: 10px;
        border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 5px;`);
        break;
      }
      case 'pulsacion': {
        // const container = document.querySelector('.container');
        const fontSize = shadow.offsetWidth / 8;  // Puedes ajustar el divisor según sea necesario
        // shadow.style.fontSize = `${fontSize}px`;

        // console.log("Este es el valor de la pulsacion")
        // console.log(this.shadow_container[idShadow])
        shadow.setAttribute("style", `position: absolute;
        top: ${this.shadow_container[idShadow].y * this.lastBloqueWidth}px;
        left: ${this.shadow_container[idShadow].x * this.lastBloqueWidth}px;
        width: ${this.shadow_container[idShadow].width}px;
        height: ${this.shadow_container[idShadow].height}px;
        font-size: ${fontSize}px`);
        break;
      }
    }

    if (this.propiedadAplicada.indexOf(idShadow) == -1) {
      this.propiedadAplicada.push(idShadow);
      //this.setPropietiesShadow(shadow, idShadow, tieldmap);
    }

    return { backgroundColor: "" }
  }



  public Update: boolean = false;
  public isMove: boolean = false;
  public idShadowMove: number = 0;
  /**
   * Funcion para mover uno de los contenedores ya creados
   * @param idShadow
   */
  enableMoveShadow(idShadow: number) {
    if (!this.isMove) {
      this.Update = true;
      // alert("Activo el move");
      this.isDraw = false;
      this.isMove = true;
      this.idShadowMove = idShadow;
    }
  }



  endMoveShadow() {
    if (this.isMove) {
      this.isDraw = false;
      this.isMove = false;
    }
  }




  public isResize: boolean = false;
  public idShadowResize: number = 0;
  /**
   * Funcion para mover uno de los contenedores ya creados
   * @param idShadow
   */
  enableResizeShadow(idShadow: number) {
    if (!this.isResize) {
      this.Update = true;
      this.isDraw = false;
      this.isResize = true;
      this.idShadowResize = idShadow;
    }
  }



  endResizeShadow() {
    this.isDraw = false;
    this.isResize = false;
  }




  endAllEvents() {
    this.isDraw = false;
    this.isMove = false;
    this.isResize = false;

    if (this.Update) {
      this.shadow_container.forEach((shadow) => {
        if (shadow.type == 'linechart') {
          this.linechart_Service.updatePositionAndSizeLineChart(shadow).subscribe((response) => {
          })
        }

        if (shadow.type == 'simplebutton') {
          this.simplebutton_Service.updatePositionAndSizeSimpleButtons(shadow).subscribe((response) => {
          })
        }


        if (shadow.type == 'indicator') {
          this.indicators_Service.updatePositionAndSizeIndicators(shadow).subscribe((response) => {
          })
        }


        if (shadow.type == 'streaming') {
          this.camera_Service.updatePositionAndSizeIndicators(shadow).subscribe((response) => {
          })
        }

        if (shadow.type == 'pulsacion') {
          this.pulsacion_Service.updatePositionAndSizeIndicators(shadow).subscribe((response) => {
          })
        }
      })
      this.Update = false;
    }
  }



  /**
   * Elimina la tarjeta del tieldmap
   * @param idShadow number
   */
  erasedShadow(idShadow: number) {
    this.shadow_container.splice(idShadow, 1);
  }


  /**
   * Esta funcion se aplica solo por el momento en graficas, esto hace que muestre los datos del blobdata
   * @param idShadow number
   */
  openData(idShadow: number) {
    this.finalizeServices.finalizeAllPolling_Event();
    const token = sessionStorage.getItem("token");
    const id_user = sessionStorage.getItem("idUser");
    if (token && id_user) {
      this.linechart_Service.getOneById(idShadow, parseInt(id_user), token).subscribe((line_chart) => {
        if (line_chart.issaveblobdata) {
          const idblobdata = line_chart.idblobdata;
          const navigationExtras: NavigationExtras = {
            queryParams: {
              idblobdata: idblobdata,
              type: "line",
              idgraph: idShadow
            }
          }
          this.router.navigate(['/blobdata'], navigationExtras);
        }else{
          this.alertService.setMessageAlert("No se puede abrir esta grafica")
        }
      })
    } else {
      //TODO:Mandar a login
      this.router.navigate(['/login'])
    }
  }
}
