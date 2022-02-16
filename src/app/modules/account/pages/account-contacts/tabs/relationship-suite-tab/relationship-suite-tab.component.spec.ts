import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipSuiteTabComponent } from './relationship-suite-tab.component';

describe('RelationshipSuiteTabComponent', () => {
  let component: RelationshipSuiteTabComponent;
  let fixture: ComponentFixture<RelationshipSuiteTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationshipSuiteTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipSuiteTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
