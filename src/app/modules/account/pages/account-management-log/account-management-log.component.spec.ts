import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagementLogComponent } from './account-management-log.component';

describe('AccountManagementLogComponent', () => {
  let component: AccountManagementLogComponent;
  let fixture: ComponentFixture<AccountManagementLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountManagementLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManagementLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
