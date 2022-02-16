import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantMeetingDetailsComponent } from './assistant-meeting-details.component';

describe('AssistantMeetingDetailsComponent', () => {
  let component: AssistantMeetingDetailsComponent;
  let fixture: ComponentFixture<AssistantMeetingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantMeetingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantMeetingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
