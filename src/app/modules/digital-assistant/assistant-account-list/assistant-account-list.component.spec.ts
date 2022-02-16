import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantAccountListComponent } from './assistant-account-list.component';

describe('AssistantAccountListComponent', () => {
  let component: AssistantAccountListComponent;
  let fixture: ComponentFixture<AssistantAccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantAccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
