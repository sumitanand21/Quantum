import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelNoYesPopupComponent } from './cancel-no-yes-popup.component';

describe('CancelNoYesPopupComponent', () => {
  let component: CancelNoYesPopupComponent;
  let fixture: ComponentFixture<CancelNoYesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelNoYesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelNoYesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
