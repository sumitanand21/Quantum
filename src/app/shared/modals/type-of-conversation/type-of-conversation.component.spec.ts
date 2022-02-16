import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfConversationComponent } from './type-of-conversation.component';

describe('TypeOfConversationComponent', () => {
  let component: TypeOfConversationComponent;
  let fixture: ComponentFixture<TypeOfConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeOfConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
