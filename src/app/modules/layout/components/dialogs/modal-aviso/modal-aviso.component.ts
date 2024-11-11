import { Component, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-modal-aviso',
  templateUrl: './modal-aviso.component.html',
  styleUrls: ['./modal-aviso.component.scss'],
})
export class ModalAvisoComponent implements AfterViewInit {
  imagen: string = 'assets/images/';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { value: number },
    private dialogRef: MatDialogRef<ModalAvisoComponent>
  ) {
    this.dialogRef.disableClose = true;

    // Configura la imagen según el valor recibido
    if (data.value === 60) {
      this.imagen += 'exelente.png';
    } else if (data.value === 30) {
      this.imagen += 'motivacion.png';
    } else if (data.value === 10) {
      this.imagen += 'preocupado.png';
    }

    // Cierra el modal automáticamente después de 3 segundos
    setTimeout(() => {
      this.dialogRef.close();
    }, 3000);
  }

  ngAfterViewInit(): void {
    // Lanza el confeti solo si el valor es 60 y después de que el modal esté completamente cargado
    if (this.data.value === 60) {
      this.lanzarConfetiPantallaCompleta();
    }
  }

  lanzarConfetiPantallaCompleta() {
    const myConfetti = confetti.create(null, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}
