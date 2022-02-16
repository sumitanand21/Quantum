import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantAccountDetailsComponent } from './assistant-account-details.component';

describe('AssistantAccountDetailsComponent', () => {
  let component: AssistantAccountDetailsComponent;
  let fixture: ComponentFixture<AssistantAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
