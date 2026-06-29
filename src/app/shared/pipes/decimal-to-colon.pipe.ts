import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'decimalToColon'
})

export class DecimalToColonPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		if (value == '0') {
			return "00:00";
		}

		if (value == 0) {
			return "00:00";
		}

		let before = '00',
			after = '00';

		if(value) {
			before = value.toString().split(".")[0],
			after = value.toString().split(".")[1];
			if(Number.isInteger(value)) {
				if(value.toString().length == 1) {
					before = "0" + before;
					after = "00";
				} else {
					before = before;
					after = "00";
				}
			} else {
				if(before.length == 1) {
					before = "0"+before;
				}
				if(after.length == 1) {
					after = after+"0";
				}
			}
		}
		return before + ":" + after;
	}

}
