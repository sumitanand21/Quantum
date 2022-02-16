import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedConversationComponent } from './archived-conversation.component';

describe('ArchivedConversationComponent', () => {
  let component: ArchivedConversationComponent;
  let fixture: ComponentFixture<ArchivedConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
