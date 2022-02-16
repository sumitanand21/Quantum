import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParametersComponent } from './add-parameters.component';

describe('AddParametersComponent', () => {
  let component: AddParametersComponent;
  let fixture: ComponentFixture<AddParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
