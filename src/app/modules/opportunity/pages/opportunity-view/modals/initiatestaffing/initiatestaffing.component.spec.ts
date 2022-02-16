import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatestaffingComponent } from './initiatestaffing.component';

describe('InitiatestaffingComponent', () => {
  let component: InitiatestaffingComponent;
  let fixture: ComponentFixture<InitiatestaffingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiatestaffingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiatestaffingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
