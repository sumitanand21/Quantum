import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignpopupComponent } from './assignpopup.component';

describe('AssignpopupComponent', () => {
  let component: AssignpopupComponent;
  let fixture: ComponentFixture<AssignpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
