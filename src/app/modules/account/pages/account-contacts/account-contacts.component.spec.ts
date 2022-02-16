import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountContactsComponent } from './account-contacts.component';

describe('AccountContactsComponent', () => {
  let component: AccountContactsComponent;
  let fixture: ComponentFixture<AccountContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
