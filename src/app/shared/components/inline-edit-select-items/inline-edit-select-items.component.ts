import {
	Component,
	OnInit,
	Input,
	EventEmitter,
	Output,
	ViewChild,
	Renderer
} from '@angular/core';
import { NgOption } from '@ng-select/ng-select';

@Component({
	selector: 'inline-edit-select-items',
	templateUrl: './inline-edit-select-items.component.html',
	styleUrls: ['./inline-edit-select-items.component.scss']
})

export class InlineEditSelectItemsComponent implements OnInit {
	public value: any;
	public selectedOptionValue: any;
	public isEditView: boolean = false;
	public docEditUnlisten: any;
	@Input() name: string;
	@Input() elementFor: string;
	@Input() txtField: string;
	@Input() selectedValue: any;
	@Input() isRequired: boolean;
	@Input() options: NgOption[];
	@Input() permission: string;
	@Output() updateValue: EventEmitter<any> = new EventEmitter();
	
	@ViewChild('container', { static: true }) container;

	constructor(private renderer: Renderer) { }

	ngOnInit() {}

	getValue(options) {
		let taxes = [];
		if (this.options != undefined && this.selectedValue) {
			for(let iRow in this.options) {
				for(let jRow in this.selectedValue) {
					if(this.options[iRow].id == this.selectedValue[jRow]) {
						taxes.push(this.options[iRow].tax_name + '(' + this.options[iRow].tax_rate + ')');
					}
				}
			}
		}

		return taxes;
	}

	showEditable() {
		this.value = this.selectedValue;
		this.isEditView = true;
		this.docEditUnlisten = this.renderer.listenGlobal('document', 'click', (event) => {
			if (!this.container.nativeElement.contains(event.target)) {
				this.showDetail();
			}
		})
	}

	save() {
		this.updateValue.emit(this.value);
	}

	showDetail() {
		this.isEditView = false;
	}

	select(event, select_component) {
		select_component.isValueSelected = true;
		return;
	}

}