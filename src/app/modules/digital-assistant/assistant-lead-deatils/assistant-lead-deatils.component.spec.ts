import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantLeadDeatilsComponent } from './assistant-lead-deatils.component';

describe('AssistantLeadDeatilsComponent', () => {
  let component: AssistantLeadDeatilsComponent;
  let fixture: ComponentFixture<AssistantLeadDeatilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantLeadDeatilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantLeadDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
