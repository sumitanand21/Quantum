import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadRejectionSelectorComponent } from './lead-rejection-selector.component';

describe('LeadRejectionSelectorComponent', () => {
  let component: LeadRejectionSelectorComponent;
  let fixture: ComponentFixture<LeadRejectionSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadRejectionSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadRejectionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
