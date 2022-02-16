import { TestBed } from '@angular/core/testing';

import { ArchivedLeadsService } from './archived-leads.service';

describe('ArchivedLeadsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArchivedLeadsService = TestBed.get(ArchivedLeadsService);
    expect(service).toBeTruthy();
  });
});
