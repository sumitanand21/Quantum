import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceLineComponent } from './add-service-line.component';

describe('AddServiceLineComponent', () => {
  let component: AddServiceLineComponent;
  let fixture: ComponentFixture<AddServiceLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddServiceLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServiceLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
