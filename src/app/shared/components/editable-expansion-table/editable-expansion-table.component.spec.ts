import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableExpansionTableComponent } from './editable-expansion-table.component';

describe('EditableExpansionTableComponent', () => {
  let component: EditableExpansionTableComponent;
  let fixture: ComponentFixture<EditableExpansionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableExpansionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableExpansionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
