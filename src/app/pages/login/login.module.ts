import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LoginComponent } from './login.component';



@NgModule({
  declarations: [
   LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    IonicModule.forRoot(),
    ReactiveFormsModule
  ]
})
export class LoginModule { }
