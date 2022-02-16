import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetAccountComponent } from './target-account.component';

describe('TargetAccountComponent', () => {
  let component: TargetAccountComponent;
  let fixture: ComponentFixture<TargetAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
