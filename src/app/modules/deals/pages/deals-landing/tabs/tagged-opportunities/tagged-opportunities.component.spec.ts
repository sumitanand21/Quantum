import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggedOpportunitiesComponent } from './tagged-opportunities.component';

describe('TaggedOpportunitiesComponent', () => {
  let component: TaggedOpportunitiesComponent;
  let fixture: ComponentFixture<TaggedOpportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaggedOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggedOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
