import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetagOrderComponent } from './retag-order.component';

describe('RetagOrderComponent', () => {
  let component: RetagOrderComponent;
  let fixture: ComponentFixture<RetagOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetagOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetagOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
