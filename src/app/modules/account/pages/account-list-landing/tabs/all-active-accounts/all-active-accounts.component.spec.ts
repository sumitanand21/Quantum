import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AllActiveAccountsComponent } from './all-active-accounts.component';
// import { AnalystAdvisorComponent } from './analyst-advisor.component';
// import { AllActiveAccountsComponent } from './all-active-accounts.component';

describe('AllActiveAccountsComponent', () => {
  let component: AllActiveAccountsComponent;
  let fixture: ComponentFixture<AllActiveAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllActiveAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllActiveAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
