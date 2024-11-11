import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    // Esperar a que las voces estén disponibles
    window.speechSynthesis.onvoiceschanged = () => {
      this.voices = window.speechSynthesis.getVoices();
    };
  }

  speak(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Buscar una voz en español latinoamericano
      const spanishVoice = this.voices.find(voice => voice.lang === 'es-419')
        || this.voices.find(voice => voice.lang === 'es-MX')
        || this.voices.find(voice => voice.lang.startsWith('es'));

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      } else {
        console.warn('Voz en español latinoamericano no encontrada, utilizando la voz predeterminada.');
      }

      utterance.lang = 'es-419';
      speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-Speech no es soportado en este navegador.');
    }
  }
}
