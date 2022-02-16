import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectpopupComponent } from './rejectpopup.component';

describe('RejectpopupComponent', () => {
  let component: RejectpopupComponent;
  let fixture: ComponentFixture<RejectpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
