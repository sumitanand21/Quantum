import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthercompetitorComponent } from './othercompetitor.component';

describe('OthercompetitorComponent', () => {
  let component: OthercompetitorComponent;
  let fixture: ComponentFixture<OthercompetitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthercompetitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthercompetitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
