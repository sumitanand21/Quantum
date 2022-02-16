import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveRequestsComponent } from './active-requests.component';

describe('ActiveRequestsComponent', () => {
  let component: ActiveRequestsComponent;
  let fixture: ComponentFixture<ActiveRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
