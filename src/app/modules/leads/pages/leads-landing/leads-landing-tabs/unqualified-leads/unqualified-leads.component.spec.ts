import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnqualifiedLeadsComponent } from './unqualified-leads.component';

describe('UnqualifiedLeadsComponent', () => {
  let component: UnqualifiedLeadsComponent;
  let fixture: ComponentFixture<UnqualifiedLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnqualifiedLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnqualifiedLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
