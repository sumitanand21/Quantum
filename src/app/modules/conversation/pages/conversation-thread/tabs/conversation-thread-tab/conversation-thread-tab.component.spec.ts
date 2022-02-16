import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { childList } from '@app/modules/conversation/pages/conversation-thread/tabs/conversation-thread-tab/conversation-thread-tab.component';

// import { childList } from './conversation-thread-tab.component';

describe('childList', () => {
  let component: childList;
  let fixture: ComponentFixture<childList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ childList ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(childList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
