import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTeamsComponent } from './account-teams.component';

describe('AccountTeamsComponent', () => {
  let component: AccountTeamsComponent;
  let fixture: ComponentFixture<AccountTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
