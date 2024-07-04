import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-aviso',
  templateUrl: './modal-aviso.component.html',
  styleUrls: ['./modal-aviso.component.scss']
})
export class ModalAvisoComponent {
  imagen: String = 'assets/images/';
  constructor(@Inject(MAT_DIALOG_DATA) public data: { value: number }) {
    if (data.value = 50) {
      this.imagen = this.imagen+'100.jpg'
    }
  }
}
