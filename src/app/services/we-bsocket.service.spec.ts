import { TestBed, inject } from '@angular/core/testing';

import { WeBSocketService } from './we-bsocket.service';

describe('WeBSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeBSocketService]
    });
  });

  it('should be created', inject([WeBSocketService], (service: WeBSocketService) => {
    expect(service).toBeTruthy();
  }));
});
