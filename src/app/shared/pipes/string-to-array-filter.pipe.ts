import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'stringToArrayFilter'
})

export class StringToArrayFilterPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		value = value.replace('[', '');
		value = value.replace(']', '');
		while (value.indexOf('"') > -1) {
			value = value.replace('"', '');
		}

		return value.split(',');
	}
}
