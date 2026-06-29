import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineMultiDatepickerComponent } from './inline-multi-datepicker.component';

describe('InlineMultiDatepickerComponent', () => {
  let component: InlineMultiDatepickerComponent;
  let fixture: ComponentFixture<InlineMultiDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineMultiDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineMultiDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
