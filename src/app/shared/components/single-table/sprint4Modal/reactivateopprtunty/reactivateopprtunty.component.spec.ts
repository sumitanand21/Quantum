import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateopprtuntyComponent } from './reactivateopprtunty.component';

describe('ReactivateopprtuntyComponent', () => {
  let component: ReactivateopprtuntyComponent;
  let fixture: ComponentFixture<ReactivateopprtuntyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactivateopprtuntyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateopprtuntyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
