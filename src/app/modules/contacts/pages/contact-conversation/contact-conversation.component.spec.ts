import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactConversationComponent } from './contact-conversation.component';

describe('ContactConversationComponent', () => {
  let component: ContactConversationComponent;
  let fixture: ComponentFixture<ContactConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
