import { TestBed } from '@angular/core/testing';

import { QualifiedLeadsService } from './qualified-leads.service';

describe('QualifiedLeadsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QualifiedLeadsService = TestBed.get(QualifiedLeadsService);
    expect(service).toBeTruthy();
  });
});
