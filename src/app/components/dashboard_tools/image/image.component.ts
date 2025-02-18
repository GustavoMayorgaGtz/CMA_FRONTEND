import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { ImageService } from 'src/app/service/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, AfterViewInit{

  @Input() id_image: number = 0;

  constructor(private router: Router, private alertService: AlertService, private imagesService: ImageService){

  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.getOneById();
  }



  public url: string = "";
  public title: string = "loading";
  getOneById(){
      this.imagesService.getImageById(this.id_image).subscribe((response) => {
        this.url = response.url;
        this.title = response.title;
        console.log(response)
      }, (err: HttpErrorResponse) => {
        console.log(err);
      })
  }

}
