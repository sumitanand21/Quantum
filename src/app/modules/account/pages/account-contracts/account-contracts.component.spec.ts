import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountContractsComponent } from './account-contracts.component';

describe('AccountContractsComponent', () => {
  let component: AccountContractsComponent;
  let fixture: ComponentFixture<AccountContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
