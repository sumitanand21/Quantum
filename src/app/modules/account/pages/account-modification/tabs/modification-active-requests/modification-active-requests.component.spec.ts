import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationActiveRequestsComponent } from './modification-active-requests.component';

describe('ModificationActiveRequestsComponent', () => {
  let component: ModificationActiveRequestsComponent;
  let fixture: ComponentFixture<ModificationActiveRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationActiveRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationActiveRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
