import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { MenuComponent } from './menu/menu.component';
import { AutentificacionComponent } from './autentificacion/autentificacion.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FuncionesComponent } from './funciones/funciones.component';
import { VariablesComponent } from './variables/variables.component';
import { LoadingComponent } from './loading/loading.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertaComponent } from './alerta/alerta.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';
import { SimpleButtonComponent } from './dashboard_tools/simple-button/simple-button.component';
import { SemaphoreComponent } from './dashboard_tools/semaphore/semaphore.component';
import { AlertComponent } from './dashboard_tools/alert/alert.component';
import { IndicatorComponent } from './dashboard_tools/indicator/indicator.component';
import { SimpleTextComponent } from './dashboard_tools/simple-text/simple-text.component';
import { SimpleTextInputComponent } from './dashboard_tools/simple-text-input/simple-text-input.component';
import { ConfigureLinearGraphComponent } from './configure_tools_components/configure-linear-graph/configure-linear-graph.component';
import { ConfigureSimpleButtonComponent } from './configure_tools_components/configure-simple-button/configure-simple-button.component';
import { LineChartComponent } from './dashboard_tools/line-chart/line-chart.component';
import { TieldmapComponent } from './tieldmap/tieldmap.component';
import { TieldmapSequenceComponent } from './tieldmap-sequence/tieldmap-sequence.component';
import { MiCuentaComponent } from './cuenta/mi-cuenta/mi-cuenta.component';
import { GestionCuentasComponent } from './cuenta/gestion-cuentas/gestion-cuentas.component';
import { AccesosApiComponent } from './cuenta/accesos-api/accesos-api.component';
import { ConfigureIndicatorComponent } from './configure_tools_components/configure-indicator/configure-indicator.component';
import { ConfigureCaneraComponent } from './configure_tools_components/configure-camera/configure-camera.component';
import { CameraViewComponent } from './dashboard_tools/camera_view/camera_view.component';
import { PulsacionComponent } from './dashboard_tools/pulsacion/pulsacion.component';
import { ConfigurePulsacionComponent } from './configure_tools_components/configure-pulsacion/configure-pulsacion.component';
import { BillingComponent } from './billing/billing.component';
import { TicketComponent } from './tickets/ticket.component';
import { HttpClientModule } from '@angular/common/http';
import { ImageComponent } from './dashboard_tools/image/image.component';
import { ConfigureImageComponent } from './configure_tools_components/configure-image/configure-image.component';
import { ApiSmsComponent } from './api-sms/api-sms.component';

const components = [NavComponent,
  MenuComponent,
  AutentificacionComponent,
  CuentaComponent,
  DashboardComponent,
  FuncionesComponent,
  VariablesComponent,
  LoadingComponent,
  AlertaComponent,
  SimpleButtonComponent,
  SemaphoreComponent,
  AlertComponent,
  IndicatorComponent,
  SimpleTextComponent,
  SimpleTextInputComponent,
  ConfigureLinearGraphComponent,
  ConfigureSimpleButtonComponent,
  ConfigureIndicatorComponent,
  ConfigurePulsacionComponent,
  LineChartComponent,
  TieldmapComponent,
  TieldmapSequenceComponent,
  MiCuentaComponent,
  GestionCuentasComponent,
  AccesosApiComponent,
  ConfigureCaneraComponent,
  CameraViewComponent,
  PulsacionComponent,
  BillingComponent,
  TicketComponent,
  ImageComponent,
  ConfigureImageComponent,
  ApiSmsComponent]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    NgChartsModule,
    HttpClientModule
  ],
  exports: components
})
export class ComponentModule { }
