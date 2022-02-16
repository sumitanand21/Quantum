import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOwnershipHistoryComponent } from './account-ownership-history.component';

describe('AccountOwnershipHistoryComponent', () => {
  let component: AccountOwnershipHistoryComponent;
  let fixture: ComponentFixture<AccountOwnershipHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountOwnershipHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOwnershipHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
