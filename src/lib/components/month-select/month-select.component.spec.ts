import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouthSelectComponent } from './month-select.component';

describe('MouthSelectComponent', () => {
  let component: MouthSelectComponent;
  let fixture: ComponentFixture<MouthSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MouthSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MouthSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
