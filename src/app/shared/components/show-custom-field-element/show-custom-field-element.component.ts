import { Component, OnInit, Input } from '@angular/core';
//import { CustomField } from '../../models/custom-field.model';
import {
	FormGroup,
	FormBuilder,
	FormArray,
	Validators,
	FormControl
} from '@angular/forms';
export class CustomField {
  id: number;
  form_id: number;
  field_label: string;
  help_text: string;
  is_required: boolean;
  show_on_details: boolean;
  field_type: any;
  default_value: any;
  status: boolean;
}
@Component({
	selector: 'app-show-custom-field-element',
	templateUrl: './show-custom-field-element.component.html',
	styleUrls: ['./show-custom-field-element.component.scss']
})
export class ShowCustomFieldElementComponent implements OnInit {
	@Input() customFields;
	@Input() formArray;
	@Input() controls: FormArray;
	@Input() formName : FormGroup;
	@Input() isFormSubmitted: boolean;
	datepickerConfig = {
		dateInputFormat: 'YYYY-MM-DD',
		containerClass: 'theme-red'
	}

	constructor() { }

	ngOnInit() {}
}
