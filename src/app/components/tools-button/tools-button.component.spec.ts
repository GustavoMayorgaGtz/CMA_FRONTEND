import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsButtonComponent } from './tools-button.component';

describe('ToolsButtonComponent', () => {
  let component: ToolsButtonComponent;
  let fixture: ComponentFixture<ToolsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
