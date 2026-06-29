import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineEditSelectItemsComponent } from './inline-edit-select-items.component';

describe('InlineEditSelectItemsComponent', () => {
  let component: InlineEditSelectItemsComponent;
  let fixture: ComponentFixture<InlineEditSelectItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineEditSelectItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineEditSelectItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
