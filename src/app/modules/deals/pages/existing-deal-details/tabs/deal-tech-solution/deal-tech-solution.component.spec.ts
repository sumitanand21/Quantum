import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealTechSolutionComponent } from './deal-tech-solution.component';

describe('DealTechSolutionComponent', () => {
  let component: DealTechSolutionComponent;
  let fixture: ComponentFixture<DealTechSolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealTechSolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealTechSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
