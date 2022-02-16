import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOpportunitiesComponent } from './all-opportunities.component';

describe('AllOpportunitiesComponent', () => {
  let component: AllOpportunitiesComponent;
  let fixture: ComponentFixture<AllOpportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
