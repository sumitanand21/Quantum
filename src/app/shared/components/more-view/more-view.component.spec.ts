import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreViewComponent } from './more-view.component';

describe('MoreViewComponent', () => {
  let component: MoreViewComponent;
  let fixture: ComponentFixture<MoreViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
