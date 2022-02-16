import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RlsViewComponent } from './rls-view.component';

describe('RlsViewComponent', () => {
  let component: RlsViewComponent;
  let fixture: ComponentFixture<RlsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RlsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RlsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
