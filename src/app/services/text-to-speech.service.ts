import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  constructor() { }

  speak(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Buscar una voz en español latinoamericano
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(voice => voice.lang === 'es-419') 
        || voices.find(voice => voice.lang === 'es-MX') 
        || voices.find(voice => voice.lang.startsWith('es'));

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      } else {
        console.warn('Voz en español latinoamericano no encontrada, utilizando la voz predeterminada.');
      }

      utterance.lang = 'es-419'; // Establecer el idioma a español latinoamericano
      speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-Speech no es soportado en este navegador.');
    }
  }
}

