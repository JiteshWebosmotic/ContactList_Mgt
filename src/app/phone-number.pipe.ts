import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: number): string {
    if (value) {
      let number = value.toString();
      const countryCode = '+91';
      const areaCode = number.slice(0, 3);
      const firstPart = number.slice(3, 6);
      const secondPart = number.slice(6);
      return `${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
    }
    return '';
  }

}
