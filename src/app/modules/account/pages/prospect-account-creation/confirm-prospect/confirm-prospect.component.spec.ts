import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProspectComponent } from './confirm-prospect.component';

describe('ConfirmProspectComponent', () => {
  let component: ConfirmProspectComponent;
  let fixture: ComponentFixture<ConfirmProspectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmProspectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmProspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
