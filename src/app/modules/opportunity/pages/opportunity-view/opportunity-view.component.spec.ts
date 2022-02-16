import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityViewComponent } from './opportunity-view.component';

describe('OpportunityViewComponent', () => {
  let component: OpportunityViewComponent;
  let fixture: ComponentFixture<OpportunityViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
