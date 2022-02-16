import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancelookuptabsComponent } from './advancelookuptabs.component';

describe('AdvancelookuptabsComponent', () => {
  let component: AdvancelookuptabsComponent;
  let fixture: ComponentFixture<AdvancelookuptabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancelookuptabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancelookuptabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
