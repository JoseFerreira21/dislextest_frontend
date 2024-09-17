import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import confetti from 'canvas-confetti';  

@Component({
  selector: 'app-modal-aviso',
  templateUrl: './modal-aviso.component.html',
  styleUrls: ['./modal-aviso.component.scss'],
})
export class ModalAvisoComponent {
  imagen: string = 'assets/images/';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { value: number },
    private dialogRef: MatDialogRef<ModalAvisoComponent>,
  ) {
    // Deshabilitar el cierre del modal al hacer clic fuera de él o con la tecla ESC
    this.dialogRef.disableClose = true;

    if (data.value === 60) {
      this.imagen += 'exelente.png';
      this.lanzarConfeti();
    } else if (data.value === 30) {
      this.imagen += 'motivacion.png';
    } else if (data.value === 10) {
      this.imagen += 'preocupado.png';
    }
    setTimeout(() => {
      this.dialogRef.close();
    }, 3000);
  }

  lanzarConfeti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}
