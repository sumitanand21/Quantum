import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosereasonComponent } from './closereason.component';

describe('ClosereasonComponent', () => {
  let component: ClosereasonComponent;
  let fixture: ComponentFixture<ClosereasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosereasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosereasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
