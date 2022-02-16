import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsTwoComponent } from './account-details-two.component';

describe('AccountDetailsTwoComponent', () => {
  let component: AccountDetailsTwoComponent;
  let fixture: ComponentFixture<AccountDetailsTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDetailsTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDetailsTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
