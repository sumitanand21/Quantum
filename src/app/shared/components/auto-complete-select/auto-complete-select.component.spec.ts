import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteSelectComponent } from './auto-complete-select.component';

describe('AutoCompleteSelectComponent', () => {
  let component: AutoCompleteSelectComponent;
  let fixture: ComponentFixture<AutoCompleteSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCompleteSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
