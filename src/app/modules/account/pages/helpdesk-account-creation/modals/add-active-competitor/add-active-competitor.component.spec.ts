import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActiveCompetitorComponent } from './add-active-competitor.component';

describe('AddActiveCompetitorComponent', () => {
  let component: AddActiveCompetitorComponent;
  let fixture: ComponentFixture<AddActiveCompetitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActiveCompetitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActiveCompetitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
