import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisqualifiedLeadsComponent } from './disqualified-leads.component';

describe('DisqualifiedLeadsComponent', () => {
  let component: DisqualifiedLeadsComponent;
  let fixture: ComponentFixture<DisqualifiedLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisqualifiedLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisqualifiedLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
