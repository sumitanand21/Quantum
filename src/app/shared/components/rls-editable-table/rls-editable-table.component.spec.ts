import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RLSEditableTableComponent } from './rls-editable-table.component';

describe('RLSEditableTabelComponent', () => {
  let component: RLSEditableTableComponent;
  let fixture: ComponentFixture<RLSEditableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RLSEditableTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RLSEditableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
