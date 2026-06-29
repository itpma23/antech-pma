import {
	Component,
	OnInit,
	Input,
	EventEmitter,
	Output,
	ViewChild,
	Renderer
} from '@angular/core';
import { DatePipe } from '@angular/common'

@Component({
	selector: 'inline-edit-date',
	templateUrl: './inline-edit-date.component.html',
	styleUrls: ['./inline-edit-date.component.scss']
})

export class InlineEditDateComponent implements OnInit {
	public value: any;
	public isEditView: boolean = false;
	public docEditUnlisten: any;
	@Input() name: string;
	@Input() elementFor: string;
	@Input() fieldValue: Date;
	@Input() isRequired: boolean;
	@Input() datepickerConfigs: any;
	@Input() format: string;
	@Input() mindate: Date;
	@Input() permission: string;
	@Output() updateValue: EventEmitter<any> = new EventEmitter();
	@Output() changeStartDate: EventEmitter<any> = new EventEmitter();
	
	@ViewChild('container', {static: true}) container;

	constructor(private renderer: Renderer, public datepipe: DatePipe) { }

	ngOnInit() {
		if(this.mindate) {
			this.mindate = new Date(this.mindate);
		}
	}

	showEditable() {
		this.value = this.fieldValue;
		this.isEditView = true;

		this.docEditUnlisten = this.renderer.listenGlobal('document', 'click', (event) => {
			if (!this.container.nativeElement.contains(event.target)) {
			}
		})
	}

	save() {
		this.fieldValue = new Date(this.fieldValue);
		let latest_date =this.datepipe.transform(this.fieldValue, 'yyyy-MM-dd');
		this.isEditView = false;
		this.updateValue.emit(latest_date);
	}

	showDetail() {
		this.isEditView = false;
	}

	startDateChange($event) {
		this.changeStartDate.emit($event);
	}
}
