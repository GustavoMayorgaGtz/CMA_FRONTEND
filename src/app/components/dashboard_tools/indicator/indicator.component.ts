import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertService } from 'src/app/service/alert.service';
import { IndicatorService } from 'src/app/service/indicators_service';
import { SignalService } from 'src/app/service/signal_websocket.service';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit, OnChanges {

  @Input() id_indicator!: number;

  title: string = "";
  description: string = "";
  symbol: string = "";
  dashboard!: number;
  type_data_in: string = "";
  type_data_design: string = "";
  groupName: string = "";


  constructor(private indicatorService: IndicatorService,
    private signalService: SignalService,
    private alertService: AlertService
  ) { }

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const idUserString = sessionStorage.getItem("idUser");
      if (idUserString) {
        this.indicatorService.getOne(parseInt(idUserString), this.id_indicator).subscribe((data) => {
          const actualIndicator = data;
          this.title = actualIndicator.title;
          this.description = actualIndicator.description;
          this.symbol = actualIndicator.symbol;
          this.dashboard = actualIndicator.dashboard;
          this.type_data_in = actualIndicator.type_data_in;
          this.type_data_design = actualIndicator.type_data_design;
          this.groupName = actualIndicator.groupname;
          this.signalService.groupName(actualIndicator.groupname);
        }, (err: HttpErrorResponse) => {
          this.alertService.setMessageAlert("No se pudo obtener el indicador, intentalo mas tarde." + err.message);
        })
      }
    }
  }

  public data: any;
  ngOnInit(): void {
    this.signalService.dataRecive.subscribe((response) => {
      console.log(response);
      this.data = response;
    })
  }
}
