import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UnsubscriptionError } from 'rxjs';
import { loginBuilder, registerBuilder } from 'src/app/interfaces/LoginInterface/login.interface';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  public showInformationMenu: number = 1;
  public isLogin = true;
  public loginGroup!: loginBuilder;
  public registerGroup!: registerBuilder;

  constructor(
    private builder: FormBuilder
    , private servicios: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loginGroup = this.builder.group({
      nombre_usuario: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    }) as loginBuilder;

    this.registerGroup = this.builder.group({
      nombre_usuario: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
    }) as registerBuilder;


    this.userSavedSession();
  }



  userSavedSession(){
    const idUser = localStorage.getItem("idUser");
    const token = localStorage.getItem("token");
    const usrname = localStorage.getItem("usrname");
    const pwd = localStorage.getItem("pwd");
    // console.log("Obteniendo datos de logueo:", idUser, token, usrname, pwd    )
    if (idUser && token && pwd && usrname) {
      // console.log("Si esta logueado con todo ")
      this.servicios.login_user({ nombre_usuario: usrname, password: pwd }).subscribe((res) => {
        localStorage.removeItem("token");
        localStorage.removeItem("idUser");
        localStorage.setItem("token", res.token);
        localStorage.setItem("idUser", res.user.toString());
        sessionStorage.removeItem("idUser");
        sessionStorage.removeItem("token")
        sessionStorage.clear();
        sessionStorage.setItem("token", res.token);
        sessionStorage.setItem("idUser", res.user.toString());
        this.validAuthLoading = true;
        if (res) {
            this.router.navigate(['/dashboard'])
        } else {
          this.alertService.setMessageAlert("Datos incorrectos, vuelve a intentarlo")
        }
      }, (err: HttpErrorResponse) => {
        this.validAuthLoading = false;
        if (err.status == 401) {
          this.alertService.setMessageAlert("Datos incorrectos, vuelve a intentarlo")
        } else {
          this.alertService.setMessageAlert("No se pudo iniciar sesion, intentalo despues.")
        }
      })
    }else{
      sessionStorage.removeItem("idUser");
      sessionStorage.removeItem("token");
      sessionStorage.clear();
    }
  }

  ngOnInit(): void {
  }



  public validAuthLoading: boolean = false;
  public isLoadingRegister: boolean = true;
  changeLogin_Status() {
    this.isLogin = !this.isLogin;
  }

  loggear(renemberme: boolean) {
    this.validAuthLoading = true;
    if (this.loginGroup.valid) {
      const username = this.loginGroup.controls.nombre_usuario.value;
      const password = this.loginGroup.controls.password.value;
      this.servicios.login_user({ nombre_usuario: username, password }).subscribe((res) => {
        if (renemberme) {
       
          localStorage.setItem("token", res.token);
          localStorage.setItem("idUser", res.user.toString());
          localStorage.setItem("pwd", password);
          localStorage.setItem("usrname", username);
          sessionStorage.setItem("token", res.token);
          sessionStorage.setItem("idUser", res.user.toString());
          this.validAuthLoading = true;
          if (res) {
            this.router.navigate(['/dashboard'])
          } else {
            this.alertService.setMessageAlert("Datos incorrectos, vuelve a intentarlo")
          }
        } else {
          sessionStorage.setItem("token", res.token);
          sessionStorage.setItem("idUser", res.user.toString());
          this.validAuthLoading = true;
          if (res) {
            this.router.navigate(['/dashboard'])
          } else {
            this.alertService.setMessageAlert("Datos incorrectos, vuelve a intentarlo")
          }
        }

      
      }, (err: HttpErrorResponse) => {
        this.validAuthLoading = false;
        if (err.status == 401) {
          this.alertService.setMessageAlert("Datos incorrectos, vuelve a intentarlo")
        } else {
          this.alertService.setMessageAlert("No se pudo iniciar sesion, intentalo despues.")
        }
      })
    } else {
      this.validAuthLoading = false
      alert("Llena todos los campos");
    }
  }

  register() {
    if (this.registerGroup.valid) {
      this.isLoadingRegister = false;
      const nombre_usuario = this.registerGroup.controls.nombre_usuario.value;
      const correo = this.registerGroup.controls.correo.value;
      const password = this.registerGroup.controls.password.value;
      const telefono = this.registerGroup.controls.telefono.value;
      this.servicios.registerPrimaryUser(nombre_usuario, correo, password, telefono).subscribe((res) => {
        this.isLoadingRegister = true;
        this.alertService.setMessageAlert("Usuario registrado");
        this.isLogin = true;
      }, (err: HttpErrorResponse) => {
        this.isLoadingRegister = true;
        this.alertService.setMessageAlert("No se pudo registrar el usuario. err: " + err.message);

      })
    } else {
      if (this.registerGroup.controls.correo.valid) {
        alert("Llena todos los campos")
      } else {
        alert("Correo electronico no valido.")
      }
    }
  }
}
