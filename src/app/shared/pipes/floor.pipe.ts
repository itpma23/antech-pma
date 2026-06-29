import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'floor'
})
export class FloorPipe implements PipeTransform {
  transform(value: any): number {
    const num = Number(value);
    if (isNaN(num)) return 0;
    return Math.floor(num);
  }
}