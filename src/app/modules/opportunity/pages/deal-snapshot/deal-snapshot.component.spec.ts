import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealSnapshotComponent } from './deal-snapshot.component';

describe('DealSnapshotComponent', () => {
  let component: DealSnapshotComponent;
  let fixture: ComponentFixture<DealSnapshotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealSnapshotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
