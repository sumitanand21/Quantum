import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAccessIssueComponent } from './account-access-issue.component';

describe('AccountAccessIssueComponent', () => {
  let component: AccountAccessIssueComponent;
  let fixture: ComponentFixture<AccountAccessIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAccessIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAccessIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
