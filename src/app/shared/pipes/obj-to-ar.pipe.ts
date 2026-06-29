import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'objToAr'
})

export class ObjToArPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		let arr = [];
		value = JSON.parse(value);
		value.forEach(function (element) {
			arr.push(element);
		});

		return arr;
	}

}
