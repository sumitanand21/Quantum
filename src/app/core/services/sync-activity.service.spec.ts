import { TestBed } from '@angular/core/testing';

import { SyncActivityService } from './sync-activity.service';

describe('SyncActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SyncActivityService = TestBed.get(SyncActivityService);
    expect(service).toBeTruthy();
  });
});
