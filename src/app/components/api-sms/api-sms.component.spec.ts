import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiSmsComponent } from './api-sms.component';

describe('ApiSmsComponent', () => {
  let component: ApiSmsComponent;
  let fixture: ComponentFixture<ApiSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiSmsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
