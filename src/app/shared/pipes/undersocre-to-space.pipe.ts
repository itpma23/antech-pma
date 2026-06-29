import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 	name: 'undersocreToSpace'
})

export class UndersocreToSpacePipe implements PipeTransform {

	transform(value: any, args?: any): any {
		return value.replace("_"," ");
	}

}
