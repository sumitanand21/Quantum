import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOwnerPopupComponent } from './account-owner-popup.component';

describe('AccountOwnerPopupComponent', () => {
  let component: AccountOwnerPopupComponent;
  let fixture: ComponentFixture<AccountOwnerPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountOwnerPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOwnerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
