import { TestBed } from '@angular/core/testing';

import { GeotifService } from './geotif.service';

describe('GeotifService', () => {
  let service: GeotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
