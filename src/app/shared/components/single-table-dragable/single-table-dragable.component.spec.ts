import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTableDragableComponent } from './single-table-dragable.component';

describe('SingleTableDragableComponent', () => {
  let component: SingleTableDragableComponent;
  let fixture: ComponentFixture<SingleTableDragableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleTableDragableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTableDragableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
