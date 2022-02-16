import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncEditableTableComponent } from './sync-editable-table.component';

describe('SyncEditableTableComponent', () => {
  let component: SyncEditableTableComponent;
  let fixture: ComponentFixture<SyncEditableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncEditableTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncEditableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
