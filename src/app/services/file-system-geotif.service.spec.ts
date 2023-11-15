import { TestBed } from '@angular/core/testing';

import { FileSystemGeotifService } from './file-system-geotif.service';

describe('FileSystemGeotifService', () => {
  let service: FileSystemGeotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileSystemGeotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
