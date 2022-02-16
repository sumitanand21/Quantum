import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgemanagementComponent } from './knowledgemanagement.component';

describe('KnowledgemanagementComponent', () => {
  let component: KnowledgemanagementComponent;
  let fixture: ComponentFixture<KnowledgemanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgemanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
