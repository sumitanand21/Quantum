import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSubmitPopupComponent } from './confirm-submit-popup.component';

describe('ConfirmSubmitPopupComponent', () => {
  let component: ConfirmSubmitPopupComponent;
  let fixture: ComponentFixture<ConfirmSubmitPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSubmitPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSubmitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
