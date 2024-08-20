import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SoundService } from '@services/sound.service';


@Component({
  selector: 'app-bienvenida-alumno',
  templateUrl: './bienvenida-alumno.component.html',
  styleUrls: ['./bienvenida-alumno.component.css']
})
export class BienvenidaAlumnoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BienvenidaAlumnoComponent>,
    private soundService: SoundService,
    @Inject(MAT_DIALOG_DATA) public alumno: any
  ) { }

  onCancel(): void {
    this.dialogRef.close();
    this.soundService.CancelarTestSonido();
  }

  onComenzar(): void {
    console.log('Comenzando el juego para:', this.alumno.nombre);
    this.dialogRef.close(this.alumno);  // Pasa todo el objeto alumno, incluyendo el ID
    this.soundService.EmpezarTestSonido();
  }
  

  ngOnInit(): void {
  
  }
}