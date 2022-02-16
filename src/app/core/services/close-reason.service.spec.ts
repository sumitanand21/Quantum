import { TestBed } from '@angular/core/testing';

import { CloseReasonService } from './close-reason.service';

describe('CloseReasonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloseReasonService = TestBed.get(CloseReasonService);
    expect(service).toBeTruthy();
  });
});
