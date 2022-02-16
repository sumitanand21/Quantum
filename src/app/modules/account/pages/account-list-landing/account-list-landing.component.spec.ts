import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListLandingComponent } from './account-list-landing.component';

describe('AccountListLandingComponent', () => {
  let component: AccountListLandingComponent;
  let fixture: ComponentFixture<AccountListLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountListLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
