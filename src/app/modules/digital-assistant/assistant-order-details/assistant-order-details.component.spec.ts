import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantOrderDetailsComponent } from './assistant-order-details.component';

describe('AssistantOrderDetailsComponent', () => {
  let component: AssistantOrderDetailsComponent;
  let fixture: ComponentFixture<AssistantOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantOrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
