import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  gotoschool(){
    window.location.href = "https://cmasystems.com.mx/learning/"
  }
}
