import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossreasonComponent } from './lossreason.component';

describe('LossreasonComponent', () => {
  let component: LossreasonComponent;
  let fixture: ComponentFixture<LossreasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossreasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossreasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
