import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadScoreComponent } from './lead-score.component';

describe('LeadScoreComponent', () => {
  let component: LeadScoreComponent;
  let fixture: ComponentFixture<LeadScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
