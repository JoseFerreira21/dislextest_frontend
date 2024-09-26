import { Component } from '@angular/core';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PerfilComponent } from '../dialogs/perfil/perfil.component'; 
import { GlobalService } from '@services/global.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;
  showRegister = false;
  error: string | null = null;
  perfil: any;
  avatarUrl: string  = '';

  userName: string | undefined; 
  userEmail: string | undefined; 
  
  constructor(
    private dialog: MatDialog,
    private globalService: GlobalService,
    private authService: AuthService,
    private route: Router,
  ) {
    this.generateRandomAvatar(); // Llama a la función para generar el avatar al cargar el componente
  }

  generateRandomAvatar() {
    const randomSeed = Math.random().toString(36).substring(7); // Genera un string aleatorio
    const avatarId = encodeURIComponent(randomSeed); // Encodea el seed para que sea válido en una URL

    fetch(`https://api.multiavatar.com/${avatarId}.svg`)
      .then(res => res.text())
      .then(svg => {
        this.avatarUrl = 'data:image/svg+xml;base64,' + btoa(svg); // Codifica el SVG en Base64
      })
      .catch(err => console.error('Error al generar el avatar:', err));
  }

  openPerfilModal() {
    this.dialog.open(PerfilComponent, {
      width: '600px',
      disableClose: true
    });
  }


  logout (){
    this.authService.logout();
    this.route.navigate(['/login']);
  }
  
  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name;
      this.userEmail = user.email;
    } else {
      this.error = 'No se pudo obtener el nombre del usuario.';
      console.error('No se pudo obtener el nombre del usuario.');
    }
  }
}
