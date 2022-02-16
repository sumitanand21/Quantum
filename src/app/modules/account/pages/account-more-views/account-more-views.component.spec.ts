import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMoreViewsComponent } from './account-more-views.component';

describe('AccountMoreViewsComponent', () => {
  let component: AccountMoreViewsComponent;
  let fixture: ComponentFixture<AccountMoreViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMoreViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMoreViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
