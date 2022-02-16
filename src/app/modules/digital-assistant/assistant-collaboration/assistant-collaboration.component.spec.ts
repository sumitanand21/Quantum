import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantCollaborationComponent } from './assistant-collaboration.component';

describe('AssistantCollaborationComponent', () => {
  let component: AssistantCollaborationComponent;
  let fixture: ComponentFixture<AssistantCollaborationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantCollaborationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantCollaborationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
