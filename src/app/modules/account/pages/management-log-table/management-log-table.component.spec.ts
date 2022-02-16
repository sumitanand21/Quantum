import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementLogTableComponent } from './management-log-table.component';

describe('ManagementLogTableComponent', () => {
  let component: ManagementLogTableComponent;
  let fixture: ComponentFixture<ManagementLogTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementLogTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
