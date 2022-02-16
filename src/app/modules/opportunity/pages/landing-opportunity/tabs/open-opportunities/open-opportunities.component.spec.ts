import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOpportunitiesComponent } from './open-opportunities.component';

describe('OpenOpportunitiesComponent', () => {
  let component: OpenOpportunitiesComponent;
  let fixture: ComponentFixture<OpenOpportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
