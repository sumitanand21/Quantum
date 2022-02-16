import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigActiveRequestsComponent } from './assig-active-requests.component';

describe('AssigActiveRequestsComponent', () => {
  let component: AssigActiveRequestsComponent;
  let fixture: ComponentFixture<AssigActiveRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigActiveRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigActiveRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
