import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCustomFieldElementComponent } from './show-custom-field-element.component';

describe('ShowCustomFieldElementComponent', () => {
  let component: ShowCustomFieldElementComponent;
  let fixture: ComponentFixture<ShowCustomFieldElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCustomFieldElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCustomFieldElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
