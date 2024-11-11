import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PasswordPromptComponent } from '../password-prompt/password-prompt.component';
import { SoundService } from '@services/sound.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-modal-despedida',
  templateUrl: './despedida-alumno.component.html',
  styleUrls: ['./despedida-alumno.component.scss']
})
export class ModalDespedidaComponent implements OnInit {
  @ViewChild('confettiCanvas', { static: true }) confettiCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private dialogRef: MatDialogRef<ModalDespedidaComponent>,
    private dialog: MatDialog,
    private soundService: SoundService,
    @Inject(MAT_DIALOG_DATA) public data: { alumno: any }
  ) {
    this.dialogRef.disableClose = true; // Deshabilitar el cierre del modal con clic fuera de él o ESC
  }

  ngOnInit(): void {
    this.soundService.WinningTestSonido(); // Reproduce un sonido de celebración al abrir el modal
    this.lanzarConfeti(); // Lanza el confeti al abrir el modal
  }

  lanzarConfeti() {
    const myConfetti = confetti.create(this.confettiCanvas.nativeElement, {
      resize: true, // Ajusta el canvas automáticamente cuando cambia el tamaño
      useWorker: true // Usa un worker para mejorar el rendimiento
    });

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  cerrar() {
    const dialogRef = this.dialog.open(PasswordPromptComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close();
        this.soundService.EmpezarTestSonido();
      }
    });
  }
}
