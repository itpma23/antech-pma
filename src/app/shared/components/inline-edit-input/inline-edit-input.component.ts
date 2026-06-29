import {
	Component,
	OnInit,
	Input,
	EventEmitter,
	Output,
	ViewChild,
	Renderer
} from '@angular/core';

@Component({
	selector: 'inline-edit-input',
	templateUrl: './inline-edit-input.component.html',
	styleUrls: ['./inline-edit-input.component.scss']
})

export class InlineEditInputComponent implements OnInit {
	public value: any;
	public isEditView: boolean = false;
	public docEditUnlisten: any;
	@Input() type: any;
	@Input() name: string;
	@Input() elementFor: string;
	@Input() fieldValue: string;
	@Input() isRequired: boolean;
	@Input() pattern: string;
	@Input() minLength: number;
	@Input() maxLength: number;
	@Input() permission: string;
	@Output() updateValue: EventEmitter<any> = new EventEmitter();
	
	@ViewChild('container', {static: true}) container;

	constructor(private renderer: Renderer) { }

	ngOnInit() {}

	showEditable() {
		this.value = this.fieldValue;
		this.isEditView = true;

		this.docEditUnlisten = this.renderer.listenGlobal('document', 'click', (event) => {
			if(!this.container.nativeElement.contains(event.target)) {
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

}
