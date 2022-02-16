import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OBDistributionComponent } from './ob-distribution.component';

describe('OBDistributionComponent', () => {
  let component: OBDistributionComponent;
  let fixture: ComponentFixture<OBDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OBDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OBDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
