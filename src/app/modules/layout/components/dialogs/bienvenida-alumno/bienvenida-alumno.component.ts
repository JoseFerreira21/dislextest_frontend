import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SoundService } from '@services/sound.service';
import { PasswordPromptComponent } from '../password-prompt/password-prompt.component'; 
import { AuthService } from '@services/auth.service';


@Component({
  selector: 'app-bienvenida-alumno',
  templateUrl: './bienvenida-alumno.component.html',
  styleUrls: ['./bienvenida-alumno.component.scss']
})
export class BienvenidaAlumnoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BienvenidaAlumnoComponent>,
    private soundService: SoundService,
    @Inject(MAT_DIALOG_DATA) public alumno: any,
    private dialog: MatDialog, // Inyectar MatDialog para abrir el modal de contraseña
  ) { 
    // Deshabilitar el cierre del modal al hacer clic fuera de él o con la tecla ESC
    this.dialogRef.disableClose = true;
  }

    onCancel(): void {
      const dialogRef = this.dialog.open(PasswordPromptComponent); // Abrir el nuevo modal de contraseña
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close(); // Cerrar el modal de bienvenida si la contraseña es válida
          this.soundService.CancelarTestSonido();
        }
      });
    }

  onComenzar(): void {
    console.log('Comenzando el juego para:', this.alumno.nombre);
    this.dialogRef.close(this.alumno);  // Pasa todo el objeto alumno, incluyendo el ID
    this.soundService.EmpezarTestSonido();
  }
  

  ngOnInit(): void {
  
  }
}