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
import { PerfilService } from '@services/perfil.service';
import { AuthService } from '@services/auth.service';
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  @ViewChild('PerfilForm') myNgForm: any;

  entidad = {} as FormGroup;
  status: RequestStatus = 'init';
  user$ = this.authService.user$;
  showRegister = false;
  perfil: any;

  constructor(
    //private testService: TestService,
    private perfilService: PerfilService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    //this.crearFormulario();
    this.obtenerPerfilEntidad();
  }

  ngOnInit(): void {
  }

  //crearFormulario() {
    form =   this.entidad = this.formBuilder.nonNullable.group({
      tipoEntidad: ['PR'],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: [''],
      telefono: [''],
      direccion: [''],
      nroDocumento: [''],
      usuarioId: [this.user$.value?.id],
    });


  obtenerPerfilEntidad() {
    this.perfilService.getPerfilEntidad()
    .subscribe(res => {
        let perfilEntidad = this.perfil = res;
        console.log('Resultados: ', this.perfil);
        
        let respuesta: any; 
        respuesta = JSON.parse(JSON.stringify(res));
        console.log(respuesta.value?.nombre);
        
        if (!perfilEntidad) {
          this.form.controls.nombre.setValue("teste");
          this.showRegister = true;
        }else{
        this.form.controls.nombre.setValue(respuesta.nombre);
        this.showRegister = false;
      }
      },
      (err) => {
        console.log(err)}
    );
    
  }

  registrarPerfilEntidad() {
    this.perfilService.postPerfilProfesor(this.entidad.value).subscribe(
      (res) => {
        //this.recuperarEntidad(this.entidad.controls['nroDocumento'].value)

        this.myNgForm.resetForm();
        this.entidad.reset({
          tipoEntidad: 'PR',
        });
      },
      (err) => console.log(err)
    );
  }
}
