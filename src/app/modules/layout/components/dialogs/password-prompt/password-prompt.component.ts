import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-password-prompt',
  templateUrl: './password-prompt.component.html',
  styleUrls: ['./password-prompt.component.scss']
})
export class PasswordPromptComponent implements OnInit {
  password: string = '';
  error: string | null = null;
  hidePassword: boolean = true; 
  userName: string | undefined; // Propiedad para almacenar el nombre del usuario

  constructor(
    public dialogRef: MatDialogRef<PasswordPromptComponent>,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name; // Asignar el nombre del usuario a la propiedad userName
    } else {
      this.error = 'No se pudo obtener el nombre del usuario.';
      console.error('No se pudo obtener el nombre del usuario.');
    }
  }

  validatePassword() {
    const email = this.authService.getUser()?.email;
    if (email) {
      this.authService.login(email, this.password).subscribe(
        () => {
          this.dialogRef.close(true); // Cerrar el modal si la contraseña es válida
        },
        () => {
          this.error = 'Contraseña incorrecta. Inténtalo de nuevo.';
        }
      );
    } else {
      this.error = 'No se pudo obtener el email del usuario. Inténtalo de nuevo.';
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword; // Alterna la visibilidad de la contraseña
  }

  close() {
    this.dialogRef.close(false); // Cerrar el modal sin validar
  }
}
