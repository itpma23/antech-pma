import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineEditHoursComponent } from './inline-edit-hours.component';

describe('InlineEditHoursComponent', () => {
  let component: InlineEditHoursComponent;
  let fixture: ComponentFixture<InlineEditHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineEditHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineEditHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
