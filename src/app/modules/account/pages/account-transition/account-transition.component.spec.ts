import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransitionComponent } from './account-transition.component';

describe('AccountTransitionComponent', () => {
  let component: AccountTransitionComponent;
  let fixture: ComponentFixture<AccountTransitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountTransitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
