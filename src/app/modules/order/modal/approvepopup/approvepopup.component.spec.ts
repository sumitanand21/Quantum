import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovepopupComponent } from './approvepopup.component';

describe('ApprovepopupComponent', () => {
  let component: ApprovepopupComponent;
  let fixture: ComponentFixture<ApprovepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovepopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
