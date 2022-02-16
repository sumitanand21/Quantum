import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountContactsTabComponent } from './account-contacts-tab.component';

describe('AccountContactsTabComponent', () => {
  let component: AccountContactsTabComponent;
  let fixture: ComponentFixture<AccountContactsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountContactsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountContactsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
