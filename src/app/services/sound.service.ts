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
  private animoSonido: Howl;
  private equivocadoSonido: Howl;
  private empezarTestSonido: Howl;
  private cancelarTestSonido: Howl;
  private winningTestSonido: Howl;
  

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
      src: ['assets/sounds/hard-applause.mp3']
    });

    this.animoSonido = new Howl({
      src: ['assets/sounds/small-applause.mp3']
    });

    this.equivocadoSonido = new Howl({
      src: ['assets/sounds/negative-beeps.mp3']
    });
    
    this.empezarTestSonido = new Howl({
      src: ['assets/sounds/start-button.mp3']
    });

    this.cancelarTestSonido = new Howl({
      src: ['assets/sounds/cancel-button.mp3']
    });

    this.winningTestSonido = new Howl({
      src: ['assets/sounds/winning.mp3']
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

  AnimoSonido(): void {
    this.animoSonido.play();
  }

  EquivocadoSonido(): void {
    this.equivocadoSonido.play();
  }
  
  EmpezarTestSonido(): void {
    this.empezarTestSonido.play();
  }

  CancelarTestSonido(): void {
    this.cancelarTestSonido.play();
  }

  WinningTestSonido(): void {
    this.winningTestSonido.play();
  }
}