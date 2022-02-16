import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalOwnerChangeComponent } from './vertical-owner-change.component';

describe('VerticalOwnerChangeComponent', () => {
  let component: VerticalOwnerChangeComponent;
  let fixture: ComponentFixture<VerticalOwnerChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticalOwnerChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalOwnerChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
