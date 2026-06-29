import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-error-dialog',
	templateUrl: './error-dialog.component.html',
	styleUrls: ['./error-dialog.component.scss']
})

export class ErrorDialogComponent implements OnInit {
	public onClose: Subject<boolean>;
	error: any;
	errorMessages: any;

	constructor(public bsModalRef: BsModalRef) {
		this.onClose = new Subject();
	}

	ngOnInit() {}

	onCancel() {
		this.onClose.next(false);
		this.bsModalRef.hide();
	}

}
