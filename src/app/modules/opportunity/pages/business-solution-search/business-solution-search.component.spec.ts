import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSolutionSearchComponent } from './business-solution-search.component';

describe('BusinessSolutionSearchComponent', () => {
  let component: BusinessSolutionSearchComponent;
  let fixture: ComponentFixture<BusinessSolutionSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessSolutionSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessSolutionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
