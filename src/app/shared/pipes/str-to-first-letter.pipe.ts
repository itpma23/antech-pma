import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strToFirstLetter'
})
export class StrToFirstLetterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
  	return value.split(' ').map(i => i.charAt(0)).join('').toUpperCase();
  }

}
