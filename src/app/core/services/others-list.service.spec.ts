import { TestBed } from '@angular/core/testing';

import { OthersListService } from './others-list.service';

describe('OthersListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OthersListService = TestBed.get(OthersListService);
    expect(service).toBeTruthy();
  });
});
