import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsourcePopupComponent } from './leadsource-popup.component';

describe('LeadsourcePopupComponent', () => {
  let component: LeadsourcePopupComponent;
  let fixture: ComponentFixture<LeadsourcePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsourcePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsourcePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
