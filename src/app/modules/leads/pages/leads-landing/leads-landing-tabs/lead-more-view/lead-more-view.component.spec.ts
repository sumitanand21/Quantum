import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadMoreViewComponent } from './lead-more-view.component';

describe('LeadMoreViewComponent', () => {
  let component: LeadMoreViewComponent;
  let fixture: ComponentFixture<LeadMoreViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadMoreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadMoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
