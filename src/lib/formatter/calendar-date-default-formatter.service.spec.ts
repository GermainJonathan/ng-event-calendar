import { TestBed } from '@angular/core/testing';

import { CalendarDateDefaultFormatterService } from './calendar-date-default-formatter.service';

describe('CalendarDateDefaultFormatterService', () => {
  let service: CalendarDateDefaultFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarDateDefaultFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
