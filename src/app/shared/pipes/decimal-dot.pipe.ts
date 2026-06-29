import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalDot'
})
export class DecimalDotPipe implements PipeTransform {

  transform(value: any, digitInfo: string = '1.0-2'): any {
    if (value == null) return '';

    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 20
    }).format(Number(value));
  }
}
