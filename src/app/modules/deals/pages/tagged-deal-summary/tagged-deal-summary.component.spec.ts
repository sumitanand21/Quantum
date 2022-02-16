import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggedDealSummaryComponent } from './tagged-deal-summary.component';

describe('TaggedDealSummaryComponent', () => {
  let component: TaggedDealSummaryComponent;
  let fixture: ComponentFixture<TaggedDealSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaggedDealSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggedDealSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
