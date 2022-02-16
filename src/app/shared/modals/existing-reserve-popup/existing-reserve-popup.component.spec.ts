import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingReservePopupComponent } from './existing-reserve-popup.component';

describe('ExistingReservePopupComponent', () => {
  let component: ExistingReservePopupComponent;
  let fixture: ComponentFixture<ExistingReservePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingReservePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingReservePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
