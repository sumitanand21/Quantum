import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnershipHistoryListComponent } from './ownership-history-list.component';

describe('OwnershipHistoryListComponent', () => {
  let component: OwnershipHistoryListComponent;
  let fixture: ComponentFixture<OwnershipHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnershipHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnershipHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
