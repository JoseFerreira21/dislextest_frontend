import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _alumnoId: number = 0;

  setAlumnoId(alumnoId: number): void {
    this._alumnoId = alumnoId;
  }

  getAlumnoId(): number {
    return this._alumnoId;
  }
}