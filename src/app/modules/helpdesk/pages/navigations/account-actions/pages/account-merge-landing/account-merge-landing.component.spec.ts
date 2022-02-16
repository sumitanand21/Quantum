import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMergeLandingComponent } from './account-merge-landing.component';

describe('AccountMergeLandingComponent', () => {
  let component: AccountMergeLandingComponent;
  let fixture: ComponentFixture<AccountMergeLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMergeLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMergeLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
