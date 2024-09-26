import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntidadService } from '@services/entidad.service';
import { GlobalService } from '@services/global.service';
import { EntidadUsuario } from '@models/entidad';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})


export class PerfilComponent implements OnInit {
  formPerfil: FormGroup;
  perfil: EntidadUsuario | null = null;
  titulo: string = 'Perfil';
  editMode: boolean = false; // Flag para habilitar la edición

  constructor(
    private _dialogRef: MatDialogRef<PerfilComponent>,
    private _formBuilder: FormBuilder,
    private _entidadService: EntidadService,
    private _snackBar: MatSnackBar,
    private globalService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any // Puedes pasar datos adicionales si lo necesitas
  ) {
    // Inicializamos el formulario, los campos están deshabilitados por defecto
    this.formPerfil = this._formBuilder.group({
      nombre: [{ value: '', disabled: true }, Validators.required],
      apellido: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      direccion: [{ value: '', disabled: true }],
      nroDocumento: [{ value: '', disabled: true }],
      fechaNacimiento: [{ value: '', disabled: true }],
      sexo: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    // Obtener el ID de la entidad desde GlobalService
    
    this.globalService.getEntidadId().subscribe((entidadId) => {
      if (entidadId) {
        this.loadEntidadPerfil(entidadId);
      }
    });
  }

  // Cargar la entidad desde el servicio
  loadEntidadPerfil(idEntidad: number) {
    this._entidadService.getEntidadByUser(idEntidad).subscribe({
      next: (entidad: EntidadUsuario) => {
        this.perfil = entidad;

        //console.log(entidad);
        
        // Si la fecha de nacimiento es nula, asigna un valor predeterminado o deja el campo vacío
        const fechaNacimiento = entidad.fechaNacimiento ? moment(entidad.fechaNacimiento, 'YYYY-MM-DD').toDate() : null;

        this.formPerfil.patchValue({
          nombre: entidad.nombre,
          apellido: entidad.apellido,
          telefono: entidad.telefono,
          direccion: entidad.direccion,
          nroDocumento: entidad.nroDocumento,
          fechaNacimiento: fechaNacimiento,// moment(entidad.fechaNacimiento, 'DD/MM/YYYY'),
          sexo: entidad.sexo || 'M'  // Valor predeterminado 'M' si es null
        });
      },
      error: (err) => {
        this._snackBar.open('Error al cargar el perfil', 'Cerrar', {
          duration: 3000,
        });
        console.error('Error al obtener los detalles de la entidad:', err);
      }
    });
  }

  // Habilitar el modo edición
  enableEdit() {
    this.editMode = true;
    this.formPerfil.enable(); // Habilita todos los campos
  }

  // Guardar los cambios y disparar el servicio PUT
  saveChanges() {
    if (this.formPerfil.valid) {
      const fechaNacimiento = moment(
        this.formPerfil.value.fechaNacimiento
      ).format('DD/MM/YYYY');
      const fechaISO: string = moment(
        fechaNacimiento,
        'DD/MM/YYYY'
      ).toISOString();
  
      // Creando el modelo sin el 'id'
      const modelo: Omit<EntidadUsuario, 'id'> = {
        tipoEntidad: this.perfil?.tipoEntidad,
        nombre: this.formPerfil.value.nombre,
        apellido: this.formPerfil.value.apellido,
        telefono: this.formPerfil.value.telefono,
        direccion: this.formPerfil.value.direccion,
        fechaNacimiento: fechaISO, // Fecha en formato ISO
        sexo: this.formPerfil.value.sexo,
        nroDocumento: this.formPerfil.value.nroDocumento,
        usuarioId: this.perfil?.usuarioId || null
      };
  
     if (this.perfil && this.perfil.id) {
        // Usamos el id en la URL, pero no en el cuerpo del JSON
        this._entidadService.updateEntidad(this.perfil.id, modelo).subscribe({
          next: () => {
            this._snackBar.open('Perfil actualizado con éxito', 'Cerrar', {
              duration: 3000,
            });
            this._dialogRef.close();
          },
          error: (err) => {
            this._snackBar.open('Error al actualizar el perfil', 'Cerrar', {
              duration: 3000,
            });
            console.error('Error al actualizar la entidad:', err);
          }
        });
      } else {
        console.error('No se pudo encontrar el ID de la entidad.');
      }
    }
  }
  
  
  // Cerrar el modal
  cerrarModal() {
    this._dialogRef.close();
  }
}
