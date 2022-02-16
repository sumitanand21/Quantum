import { TestBed } from '@angular/core/testing';

import { DataCommService } from './data-comm.service';

describe('DataCommService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataCommService = TestBed.get(DataCommService);
    expect(service).toBeTruthy();
  });
});
