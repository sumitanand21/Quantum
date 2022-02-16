import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModificationDetailsComponent } from './view-modification-details.component';

describe('ViewModificationDetailsComponent', () => {
  let component: ViewModificationDetailsComponent;
  let fixture: ComponentFixture<ViewModificationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewModificationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewModificationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
