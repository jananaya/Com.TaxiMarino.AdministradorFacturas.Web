import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currencySymbol: string = '$', decimalCount: number = 2): string {
    if (isNaN(value)) return '';

    return `${currencySymbol}${value.toFixed(decimalCount).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
}
