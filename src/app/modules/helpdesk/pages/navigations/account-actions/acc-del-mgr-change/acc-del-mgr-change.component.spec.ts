import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccDelMgrChangeComponent } from './acc-del-mgr-change.component';

describe('AccDelMgrChangeComponent', () => {
  let component: AccDelMgrChangeComponent;
  let fixture: ComponentFixture<AccDelMgrChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccDelMgrChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccDelMgrChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
