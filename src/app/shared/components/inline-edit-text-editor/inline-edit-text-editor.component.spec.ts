import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineEditTextEditorComponent } from './inline-edit-text-editor.component';

describe('InlineEditTextEditorComponent', () => {
  let component: InlineEditTextEditorComponent;
  let fixture: ComponentFixture<InlineEditTextEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineEditTextEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineEditTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
