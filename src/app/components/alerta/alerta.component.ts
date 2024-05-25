import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss']
})
export class AlertaComponent implements OnInit, AfterViewInit{

  @ViewChild("contenedor") ContenedorLinked!: ElementRef<HTMLDivElement>;
  public contenedor!: HTMLDivElement;
  constructor(private alertService: AlertService){

  }
  ngAfterViewInit(): void {
    if(this.ContenedorLinked.nativeElement){
      this.contenedor = this.ContenedorLinked.nativeElement;
      this.contenedor.className = "hidde";
     }
  }
  


  public message: string = "Bienvenido";
  public className: string = "contenedor";
  ngOnInit(): void {
    this.alertService.getMessageAlert.subscribe((message) => {
       this.message = message;
       this.contenedor.className = "contenedor";
       setTimeout(()=>{
          this.contenedor.className = "contenedor_hide";
       }, 5000);
    })
  }

}
