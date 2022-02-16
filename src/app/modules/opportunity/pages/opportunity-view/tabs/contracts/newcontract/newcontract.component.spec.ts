import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcontractComponent } from './newcontract.component';

describe('NewcontractComponent', () => {
  let component: NewcontractComponent;
  let fixture: ComponentFixture<NewcontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
