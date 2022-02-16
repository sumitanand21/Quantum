import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovePopoverComponent } from './move-popover.component';

describe('MovePopoverComponent', () => {
  let component: MovePopoverComponent;
  let fixture: ComponentFixture<MovePopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovePopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
