import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CBUActivateComponent } from './cbu-activate.component';

describe('CBUActivateComponent', () => {
  let component: CBUActivateComponent;
  let fixture: ComponentFixture<CBUActivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CBUActivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CBUActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
