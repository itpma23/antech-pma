import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'shortName'
})

export class ShortNamePipe implements PipeTransform {

	transform(value: any, args?: any): any {
		let shortName = '';
		if (value.created_firstname && value.created_lastname) {
			let created_first = value.created_firstname.substring(0, 1),
				created_second = value.created_lastname.substring(0, 1);
			shortName = created_first + created_second;

			return shortName;
		} else if (value.firstname && value.lastname) {
			let first = value.firstname.substring(0, 1),
				second = value.lastname.substring(0, 1);
			shortName = first + second;

			return shortName.toUpperCase();
		} else {
			return 'Unknown';
		}
	}
}