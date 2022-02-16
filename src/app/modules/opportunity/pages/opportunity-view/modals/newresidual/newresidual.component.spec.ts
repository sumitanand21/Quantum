import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewresidualComponent } from './newresidual.component';

describe('NewresidualComponent', () => {
  let component: NewresidualComponent;
  let fixture: ComponentFixture<NewresidualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewresidualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewresidualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
