import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OBforecastComponent } from './obforecast.component';

describe('OBforecastComponent', () => {
  let component: OBforecastComponent;
  let fixture: ComponentFixture<OBforecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OBforecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OBforecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
