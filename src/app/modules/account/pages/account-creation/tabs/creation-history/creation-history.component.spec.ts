import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationHistoryComponent } from './creation-history.component';

describe('CreationHistoryComponent', () => {
  let component: CreationHistoryComponent;
  let fixture: ComponentFixture<CreationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
