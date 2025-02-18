import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { AlertService } from 'src/app/service/alert.service';
import { ExitService } from 'src/app/service/exit.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { auth_class } from 'src/app/graphs_class/auth_class';
import { Component, AfterViewInit } from '@angular/core';
import { ImageService } from 'src/app/service/image.service';
import { IImageCreate } from 'src/app/interfaces/ImagesInterface/image.interface.';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-configure-image',
  templateUrl: './configure-image.component.html',
  styleUrls: ['./configure-image.component.scss']
})

export class ConfigureImageComponent implements AfterViewInit, OnChanges {

  @Input() id_dashboard_selected!: number | undefined;
  @Input() id_image_selected!: number;

  public show_save_button: boolean = true;
  public authClass = new auth_class(this.router, this.authService, this.alertService);
  constructor(
    private alertService: AlertService,
    private exitService: ExitService,
    private router: Router,
    private imageService: ImageService,
    private authService: AuthService) {
    this.authClass.validateUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.id_image_selected) {
        this.imageService.getImageById(this.id_image_selected)
          .subscribe((response) => {
            this.title = response.title;
            this.url = response.url;
            this.contorno = response.contorno;
            console.log(response);
          }, (err: HttpErrorResponse) => {
            console.log(err);
          })
      }
    }
  }

  public width = 0;
  public height = 0;
  loadSizeShadow(width: number, height: number) {

  }

  ngAfterViewInit() {

  }


  private title: string = "";
  set set_title(title: string) {
    this.title = title;
  }

  get get_title() {
    return this.title;
  }

  private url: string = "";
  set set_url(url: string) {
    this.url = url;
  }

  get get_url() {
    return this.url;
  }

  private contorno: boolean = false;
  set set_contorno(contorno: boolean) {
    this.contorno = contorno;
  }
  get get_contorno() {
    return this.contorno
  }


  save_image() {
    if (!this.id_dashboard_selected) { this.alertService.setMessageAlert("No esta definido el id de dashboard"); return }
    if (!this.get_title) { this.alertService.setMessageAlert("No esta definido el titulo"); return }
    if (!this.get_url) { this.alertService.setMessageAlert("No esta definido el url"); return }


    const payload: IImageCreate = {
      title: this.get_title,
      url: this.get_url,
      contorno: this.contorno,
      id_dashboard: this.id_dashboard_selected
    }

    if (this.id_image_selected) {
      this.imageService.updateImage(payload, this.id_image_selected)
        .subscribe((response) => {
          this.alertService.setMessageAlert("Herramienta actualizada correctamente.")
          console.log(response);
          setTimeout(() => {
            this.return();
          }, 1500);
        }, (err: HttpErrorResponse) => {
          console.log(err);
          this.alertService.setMessageAlert("No se pudo actualizar la imagen correctamente.")
        })
    } else {
      this.imageService.createImage(payload)
        .subscribe((response) => {
          console.log(response);
          this.alertService.setMessageAlert("Herramienta creada correctamente.")
          setTimeout(() => {
            this.return();
          }, 1500);
        }, (err: HttpErrorResponse) => {
          console.log(err);
          this.alertService.setMessageAlert("No se pudo actualizar la imagen correctamente.")
        })
    }

  }

  /**
  * Funcion para regresar al menu principal y salir del modo configuracion
  */
  return() {
    this.exitService.setExitConfigurationGraphLine(false);
  }
}
