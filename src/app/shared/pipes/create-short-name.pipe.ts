import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'createShortName'
})

export class CreateShortNamePipe implements PipeTransform {
	transform(value: any, args?: any): any {
		if (value && value.match(/\b(\w)/g)) {
			let matches = value.match(/\b(\w)/g),
				str1 = matches.toString(),
				str2 = str1.replace(/\,/g, "");

			return str2.toUpperCase();
		}
	}
}
