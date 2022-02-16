import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskNavComponent } from './helpdesk-nav.component';

describe('HelpdeskNavComponent', () => {
  let component: HelpdeskNavComponent;
  let fixture: ComponentFixture<HelpdeskNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
