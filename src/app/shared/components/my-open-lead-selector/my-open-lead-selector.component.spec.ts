import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOpenLeadSelectorComponent } from './my-open-lead-selector.component';

describe('MyOpenLeadSelectorComponent', () => {
  let component: MyOpenLeadSelectorComponent;
  let fixture: ComponentFixture<MyOpenLeadSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOpenLeadSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOpenLeadSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
