import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleScrollTableComponent } from './simple-scroll-table.component';

describe('SimpleScrollTableComponent', () => {
  let component: SimpleScrollTableComponent;
  let fixture: ComponentFixture<SimpleScrollTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleScrollTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleScrollTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
