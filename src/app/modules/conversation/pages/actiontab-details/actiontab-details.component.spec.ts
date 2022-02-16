import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiontabDetailsComponent } from './actiontab-details.component';

describe('ActiontabDetailsComponent', () => {
  let component: ActiontabDetailsComponent;
  let fixture: ComponentFixture<ActiontabDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiontabDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiontabDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
