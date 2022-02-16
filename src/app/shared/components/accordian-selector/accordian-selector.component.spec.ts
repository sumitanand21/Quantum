import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordianSelectorComponent } from './accordian-selector.component';

describe('AccordianSelectorComponent', () => {
  let component: AccordianSelectorComponent;
  let fixture: ComponentFixture<AccordianSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccordianSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordianSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
