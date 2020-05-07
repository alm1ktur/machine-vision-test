import { TestBed } from '@angular/core/testing';

import { MachineVisionService } from './machine-vision.service';

describe('MachineVisionService', () => {
  let service: MachineVisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineVisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
