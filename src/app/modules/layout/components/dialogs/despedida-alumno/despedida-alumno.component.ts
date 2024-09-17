import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PasswordPromptComponent } from '../password-prompt/password-prompt.component'; // Asegúrate de importar el componente de contraseña
import { SoundService } from '@services/sound.service'; // Si tienes algún servicio de sonido

@Component({
  selector: 'app-modal-despedida',
  templateUrl: './despedida-alumno.component.html',
  styleUrls: ['./despedida-alumno.component.scss']
})
export class ModalDespedidaComponent {

  constructor(
    private dialogRef: MatDialogRef<ModalDespedidaComponent>,
    private dialog: MatDialog, // Inyectar MatDialog para abrir el modal de contraseña
    private soundService: SoundService // Inyectar el servicio de sonido si es necesario
  ) {
    // Deshabilitar el cierre del modal al hacer clic fuera de él o con la tecla ESC
    this.dialogRef.disableClose = true;
  }

  cerrar() {
    const dialogRef = this.dialog.open(PasswordPromptComponent); // Abrir el modal de contraseña
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(); // Cerrar el modal de despedida si la contraseña es válida
        this.soundService.EmpezarTestSonido();
      }
    });
  }
}
