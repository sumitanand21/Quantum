import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollbackcomponentComponent } from './rollbackcomponent.component';

describe('RollbackcomponentComponent', () => {
  let component: RollbackcomponentComponent;
  let fixture: ComponentFixture<RollbackcomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollbackcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollbackcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
