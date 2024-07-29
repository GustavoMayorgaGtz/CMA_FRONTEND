import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from 'src/app/service/alert.service';
import { IndicatorService } from 'src/app/service/indicators_service';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  @Input() id_indicator!: number;

  title: string = "";
  description: string = "";
  symbol: string = "";
  dashboard!: number;
  type_data_in: string = "";
  type_data_design: string = "";
  groupName: string = "";


  constructor(private indicatorService: IndicatorService,
    private alertService: AlertService
  ) { }
  
  ngOnInit(): void {
    const idUserString = sessionStorage.getItem("idUser");
    if (idUserString) {
      this.indicatorService.getOne(parseInt(idUserString), this.id_indicator).subscribe((data) => {
        console.log(data);
      }, (err: HttpErrorResponse) => {
        this.alertService.setMessageAlert("No se pudo obtener el indicador, intentalo mas tarde.");
      })
    }
  }




}
