import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesosApiComponent } from './accesos-api.component';

describe('AccesosApiComponent', () => {
  let component: AccesosApiComponent;
  let fixture: ComponentFixture<AccesosApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccesosApiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesosApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
