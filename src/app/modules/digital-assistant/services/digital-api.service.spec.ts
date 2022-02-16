import { TestBed } from '@angular/core/testing';

import { DigitalApiService } from './digital-api.service';

describe('DigitalApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DigitalApiService = TestBed.get(DigitalApiService);
    expect(service).toBeTruthy();
  });
});
