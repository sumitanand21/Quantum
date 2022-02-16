import { TestBed } from '@angular/core/testing';

import { LossreasonService } from './lossreason.service';

describe('LossreasonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LossreasonService = TestBed.get(LossreasonService);
    expect(service).toBeTruthy();
  });
});
