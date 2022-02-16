import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingAccountPopupComponent } from './existing-account-popup.component';

describe('ExistingAccountPopupComponent', () => {
  let component: ExistingAccountPopupComponent;
  let fixture: ComponentFixture<ExistingAccountPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingAccountPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingAccountPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
