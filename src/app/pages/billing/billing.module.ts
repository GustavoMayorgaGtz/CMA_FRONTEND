import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './billing.component';
import { ComponentModule } from "../../components/component.module";
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';
import { BillingRoutingModule } from './billing.routing.module';

@NgModule({
    declarations: [BillingComponent],
    imports: [
        CommonModule,
        BillingRoutingModule,
        ComponentModule,
        NgApexchartsModule,
        NgChartsModule
    ]
})
export class BillingModule { }
