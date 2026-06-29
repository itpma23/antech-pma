import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineEditDateComponent } from './inline-edit-date.component';

describe('InlineEditDateComponent', () => {
  let component: InlineEditDateComponent;
  let fixture: ComponentFixture<InlineEditDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineEditDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineEditDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
