import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormGroupDirective,
  NgForm,
  FormBuilder,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TestService } from '@services/test.service';
import { AlumnosService } from '@services/alumnos.service';
import { RequestStatus } from '@models/request-status.model';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-registrar-alumno',
  templateUrl: './registrar-alumno.component.html',
  styleUrls: ['./registrar-alumno.component.scss'],
})
export class RegistrarAlumnoComponent implements OnInit {
  @ViewChild('AluForm') myNgForm: any;

  entidad = {} as FormGroup;
  status: RequestStatus = 'init';

  alumno = {
    entidadId: 0,
  };

  profesores_alumnos_alumnos = {
    alumnoId: 0,
    profesorId: 0,
  };
  matcher = new MyErrorStateMatcher();

  constructor(
    private testService: TestService,
    private alumnosService: AlumnosService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario() {
    this.entidad = this.formBuilder.nonNullable.group({
      //this.entidad = this.fb.group({
      tipoEntidad: ['AL'],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: [''],
      telefono: [''],
      direccion: [''],
      nroDocumento: ['', Validators.required],
      usuarioId: [],
    });
  }

  registrarEntidad() {
    this.alumnosService.postAlumno(this.entidad.value).subscribe(
      (res) => {
        //this.recuperarEntidad(this.entidad.controls['nroDocumento'].value)

        this.myNgForm.resetForm();
        this.entidad.reset({
          tipoEntidad: 'AL',
        });
      },
      (err) => console.log(err)
    );
  }

  recuperarEntidad(doc: string) {
    this.testService.getEntidad(doc).subscribe((res) => {
      let respuesta: any;
      respuesta = JSON.parse(JSON.stringify(res));
      this.alumno.entidadId = respuesta.id;

      this.registrarAlumno(this.alumno);
    });
  }

  registrarAlumno(alumno: {}) {
    this.testService.postAlumno(alumno).subscribe((res) => {
      let respuesta: any;
      let id: any;
      respuesta = JSON.parse(JSON.stringify(res));
      this.profesores_alumnos_alumnos.alumnoId = respuesta.id;

      id = localStorage.getItem('profesorId');

      this.recuperarProfesor(id);
    });
  }

  recuperarProfesor(id: number) {
    this.testService.getProfesor(id).subscribe((res) => {
      let respuesta: any;
      respuesta = JSON.parse(JSON.stringify(res));

      this.profesores_alumnos_alumnos.profesorId = respuesta.id;
      this.registarAlumnoProfesor();
    });
  }

  registarAlumnoProfesor() {
    this.testService
      .postAluProfe(this.profesores_alumnos_alumnos)
      .subscribe((res) => {});
  }
}
