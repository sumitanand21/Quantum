import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreviewComponent } from './moreview.component';

describe('MoreviewComponent', () => {
  let component: MoreviewComponent;
  let fixture: ComponentFixture<MoreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
