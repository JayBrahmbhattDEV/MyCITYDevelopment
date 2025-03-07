import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'location',
})
export class LocationPipe implements PipeTransform {
  transform(value: string = '', ...args: unknown[]): unknown {
    return value ? value.split(',')[0] : value;
  }
}
