import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistntDefultMessageComponent } from './assistnt-defult-message.component';

describe('AssistntDefultMessageComponent', () => {
  let component: AssistntDefultMessageComponent;
  let fixture: ComponentFixture<AssistntDefultMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistntDefultMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistntDefultMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
