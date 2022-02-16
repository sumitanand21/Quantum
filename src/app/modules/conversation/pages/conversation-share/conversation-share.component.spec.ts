import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationShareComponent } from './conversation-share.component';

describe('ConversationShareComponent', () => {
  let component: ConversationShareComponent;
  let fixture: ComponentFixture<ConversationShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
