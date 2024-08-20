import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { alumnoEntidad } from 'src/app/interfaces/alumnoEntidad';
import { AlumnosComponent } from 'src/app/modules/alumnos/pages/alumnos/alumnos.component'; 

@Component({
  selector: 'app-eliminar-alumno',
  templateUrl: './eliminar-alumno.component.html',
  //styleUrls: ['./eliminar-alumno.component.scss']
})
export class EliminarAlumnoComponent implements OnInit  {

constructor(
  private _dialogoReferencia: MatDialogRef<EliminarAlumnoComponent>,
  @Inject(MAT_DIALOG_DATA) public dataAlumno: alumnoEntidad
){
  
}

ngOnInit(): void{
}

 confirmarEliminar(){
  if (this.dataAlumno){
    console.log(this.dataAlumno);
    this._dialogoReferencia.close("eliminar")
  }
 }

}
