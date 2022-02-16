import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAccountComponent } from './source-account.component';

describe('SourceAccountComponent', () => {
  let component: SourceAccountComponent;
  let fixture: ComponentFixture<SourceAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
