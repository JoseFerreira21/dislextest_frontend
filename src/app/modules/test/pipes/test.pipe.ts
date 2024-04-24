import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'test'
})
export class TestPipe implements PipeTransform {

  transform(palabra: string): string {
    if (!palabra) return '';
    let caracteres = palabra.split('');
    for (let i = caracteres.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [caracteres[i], caracteres[j]] = [caracteres[j], caracteres[i]]; 
    }
    return caracteres.join('');
  }

}
