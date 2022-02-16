import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffingInititatedPopupComponent } from './staffing-inititated-popup.component';

describe('StaffingInitiatedPopupComponent', () => {
  let component: StaffingInititatedPopupComponent;
  let fixture: ComponentFixture<StaffingInititatedPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffingInititatedPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffingInititatedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
