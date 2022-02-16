import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOverviewSelectorComponent } from './account-overview-selector.component';

describe('AccountOverviewSelectorComponent', () => {
  let component: AccountOverviewSelectorComponent;
  let fixture: ComponentFixture<AccountOverviewSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountOverviewSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOverviewSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
