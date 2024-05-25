import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TieldmapSequenceComponent } from './tieldmap-sequence.component';

describe('TieldmapSequenceComponent', () => {
  let component: TieldmapSequenceComponent;
  let fixture: ComponentFixture<TieldmapSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TieldmapSequenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieldmapSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
