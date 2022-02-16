import { TestBed } from '@angular/core/testing';

import { MasterApiService } from './master-api.service';

describe('MasterApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MasterApiService = TestBed.get(MasterApiService);
    expect(service).toBeTruthy();
  });
});
