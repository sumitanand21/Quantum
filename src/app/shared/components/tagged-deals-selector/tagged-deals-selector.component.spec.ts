import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggedDealsSelectorComponent } from './tagged-deals-selector.component';

describe('TaggedDealsSelectorComponent', () => {
  let component: TaggedDealsSelectorComponent;
  let fixture: ComponentFixture<TaggedDealsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaggedDealsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggedDealsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
