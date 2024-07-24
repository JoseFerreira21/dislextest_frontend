import { Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private clickSiguienteSonido: Howl;
  private clickSeleccionSonido: Howl;
  private clickDeseleccionarSonido: Howl;
  private aplausoSonido: Howl;
  
  

  constructor() {
    // Definir los sonido aquí
    this.clickSiguienteSonido = new Howl({
      src: ['assets/sounds/button-pressed.mp3']
    });
    this.clickSeleccionSonido = new Howl({
      src: ['assets/sounds/select-sound.mp3']
    });
    this.clickDeseleccionarSonido = new Howl({
      src: ['assets/sounds/unselected-incorrect-sound.mp3']
    });

    this.aplausoSonido = new Howl({
      src: ['assets/sounds/small-applause.mp3']
    });
    
  }

  ClickSiguienteSound(): void {
    this.clickSiguienteSonido.play();
  }

  ClickSeleccionarSonido(): void {
    this.clickSeleccionSonido.play();
  }

  ClickDeseleccionarSonido(): void {
    this.clickDeseleccionarSonido.play();
  }
  
  AplausoSonido(): void {
    this.aplausoSonido.play();
  }
}