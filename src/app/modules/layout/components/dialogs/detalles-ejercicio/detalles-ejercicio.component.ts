import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResultadoTestService } from '@services/resultadotest.service';
import { ResultadoEjercicio } from '@models/resultadotest.model';

@Component({
  selector: 'app-detalles-ejercicio',
  templateUrl: './detalles-ejercicio.component.html',
  styleUrls: ['./detalles-ejercicio.component.css']
})
export class DetallesEjercicioComponent implements OnInit {
  detallesEjercicio: ResultadoEjercicio[] = [];

  constructor(
    public dialogRef: MatDialogRef<DetallesEjercicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { alumnoId: number, itemId: number },
    private resultadoTestService: ResultadoTestService
  ) { }

  ngOnInit(): void {
    this.resultadoTestService.getDetallesEjercicio(this.data.alumnoId, this.data.itemId)
      .subscribe({
        next: (detalles) => {
          this.detallesEjercicio = detalles;
          //console.log(detalles);
        },
        error: (err) => {
          console.error('Error al obtener los detalles del ejercicio:', err);
        }
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
