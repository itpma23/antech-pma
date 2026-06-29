import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToggleFullscreenDirective } from '../directives/toggle-fullscreen.directive';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { InlineEditDateComponent } from './inline-edit-date/inline-edit-date.component';
import { InlineEditHoursComponent } from './inline-edit-hours/inline-edit-hours.component';
import { InlineEditInputComponent } from './inline-edit-input/inline-edit-input.component';
import { InlineEditSelectComponent } from './inline-edit-select/inline-edit-select.component';
import { InlineEditSelectItemsComponent } from './inline-edit-select-items/inline-edit-select-items.component';
import { InlineEditTextareaComponent } from './inline-edit-textarea/inline-edit-textarea.component';
import { InlineMultiDatepickerComponent } from './inline-multi-datepicker/inline-multi-datepicker.component';
import { ShowCustomFieldElementComponent } from './show-custom-field-element/show-custom-field-element.component';
import { InlineEditTextEditorComponent } from './inline-edit-text-editor/inline-edit-text-editor.component';
@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [BreadcrumbComponent,ErrorDialogComponent,InlineEditDateComponent,InlineEditTextEditorComponent,
      InlineEditHoursComponent,InlineEditInputComponent,InlineEditSelectComponent,InlineEditSelectItemsComponent,
      InlineEditTextareaComponent,InlineMultiDatepickerComponent,ShowCustomFieldElementComponent

      ],
    exports: [  ]
})

export class ShareComponentModule {}
