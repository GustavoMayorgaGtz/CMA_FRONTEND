import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiSmsService } from 'src/app/service/api-sms.service';

@Component({
  selector: 'app-api-sms',
  templateUrl: './api-sms.component.html',
  styleUrls: ['./api-sms.component.scss']
})
export class ApiSmsComponent implements OnInit {

  constructor(private router: Router, private api_sms: ApiSmsService) {
  }

  ngOnInit(): void {
    this.getToken();
  }

  getToken() {
    this.api_sms.getTokenAPI_SMS()
      .subscribe((response) => {
        console.log(response);
      }, (err) => {
        console.log(err);
      })
  }
}
