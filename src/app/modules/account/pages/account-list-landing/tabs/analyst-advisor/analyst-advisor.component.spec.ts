import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystAdvisorComponent } from './analyst-advisor.component';

describe('AnalystAdvisorComponent', () => {
  let component: AnalystAdvisorComponent;
  let fixture: ComponentFixture<AnalystAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalystAdvisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
