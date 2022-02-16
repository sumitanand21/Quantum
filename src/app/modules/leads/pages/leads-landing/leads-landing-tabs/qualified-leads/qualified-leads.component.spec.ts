import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifiedLeadsComponent } from './qualified-leads.component';

describe('QualifiedLeadsComponent', () => {
  let component: QualifiedLeadsComponent;
  let fixture: ComponentFixture<QualifiedLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualifiedLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifiedLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
