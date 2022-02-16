import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationLogComponent } from './relation-log.component';

describe('RelationLogComponent', () => {
  let component: RelationLogComponent;
  let fixture: ComponentFixture<RelationLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
