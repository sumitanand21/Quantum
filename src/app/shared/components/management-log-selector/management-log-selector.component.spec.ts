import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementLogSelectorComponent } from './management-log-selector.component';

describe('ManagementLogSelectorComponent', () => {
  let component: ManagementLogSelectorComponent;
  let fixture: ComponentFixture<ManagementLogSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementLogSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementLogSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
