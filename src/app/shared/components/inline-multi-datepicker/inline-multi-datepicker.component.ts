import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'inline-multi-datepicker',
	templateUrl: './inline-multi-datepicker.component.html',
	styleUrls: ['./inline-multi-datepicker.component.scss']
})

export class InlineMultiDatepickerComponent implements OnInit {
	dateSelected = [];
	selectedClass = [];

	constructor() { }

	ngOnInit() {}

	getDateItem(date: Date): string {
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
	}

	onValueChange(event) {
		if (event.length === undefined) {
			const date = this.getDateItem(event);
			const index = this.dateSelected.findIndex(item => {
			const testDate = this.getDateItem(item);
				return testDate === date;
			});

			console.log('Date', date, index);

			if (index < 0) {
				this.dateSelected.push(event);
			} else {
				this.dateSelected.splice(index, 1);
			}
		}

	    if (this.dateSelected.length > 0) {
			this.selectedClass = this.dateSelected.map(date => {
				return {
					date, 
					classes: ['custom-selected-date']
				}
			})
		}
	}

}
