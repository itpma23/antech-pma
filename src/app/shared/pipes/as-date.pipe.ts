import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'asDate'
})

export class AsDatePipe implements PipeTransform {

	transform(value: any, args?: any): any {
		return new Date(value);
	}
}
