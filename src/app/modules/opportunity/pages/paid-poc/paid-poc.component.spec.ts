import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidPocComponent } from './paid-poc.component';

describe('PaidPocComponent', () => {
  let component: PaidPocComponent;
  let fixture: ComponentFixture<PaidPocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidPocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
