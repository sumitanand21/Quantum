import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewindentComponent } from './viewindent.component';

describe('ViewindentComponent', () => {
  let component: ViewindentComponent;
  let fixture: ComponentFixture<ViewindentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewindentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewindentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
