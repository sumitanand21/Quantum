import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CBUpopupComponent } from './cbupopup.component';

describe('CBUpopupComponent', () => {
  let component: CBUpopupComponent;
  let fixture: ComponentFixture<CBUpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CBUpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CBUpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
