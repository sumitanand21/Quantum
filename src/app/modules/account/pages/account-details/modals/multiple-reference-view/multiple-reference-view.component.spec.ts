import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleReferenceViewComponent } from './multiple-reference-view.component';

describe('MultipleReferenceViewComponent', () => {
  let component: MultipleReferenceViewComponent;
  let fixture: ComponentFixture<MultipleReferenceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleReferenceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleReferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
