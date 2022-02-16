import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealCriteriaComponent } from './deal-criteria.component';

describe('DealCriteriaComponent', () => {
  let component: DealCriteriaComponent;
  let fixture: ComponentFixture<DealCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
