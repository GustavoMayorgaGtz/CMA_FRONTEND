import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../service/alert.service';
export class auth_class {

    constructor(private router: Router,
        private authService: AuthService,
        private alertService: AlertService) {
    }

    validateUser() {
        const idUser = sessionStorage.getItem("idUser")
        const token = sessionStorage.getItem("token")
       
        if (idUser && token) {
            this.authService.authUser(parseInt(idUser), token).subscribe((response) => {           
            }, (err: HttpErrorResponse) => {
                console.log(err);
                this.alertService.setMessageAlert("9. Vuelve a iniciar sesion...")
                    this.router.navigate(['/login'])
            })
        } else {
            this.alertService.setMessageAlert("10. Vuelve a iniciar sesion...")
            this.router.navigate(['/login']);
        }

    }
}