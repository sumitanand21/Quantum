import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationHistoryComponent } from './modification-history.component';

describe('ModificationHistoryComponent', () => {
  let component: ModificationHistoryComponent;
  let fixture: ComponentFixture<ModificationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
