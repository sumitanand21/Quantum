import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyConversationComponent } from './my-conversation.component';

describe('MyConversationComponent', () => {
  let component: MyConversationComponent;
  let fixture: ComponentFixture<MyConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
