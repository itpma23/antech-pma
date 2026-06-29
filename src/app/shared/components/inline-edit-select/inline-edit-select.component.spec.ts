import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineEditSelectComponent } from './inline-edit-select.component';

describe('InlineEditSelectComponent', () => {
  let component: InlineEditSelectComponent;
  let fixture: ComponentFixture<InlineEditSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineEditSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineEditSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
