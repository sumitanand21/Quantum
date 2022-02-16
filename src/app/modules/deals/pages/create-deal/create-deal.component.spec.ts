import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDealComponent } from './create-deal.component';

describe('CreateDealComponent', () => {
  let component: CreateDealComponent;
  let fixture: ComponentFixture<CreateDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
