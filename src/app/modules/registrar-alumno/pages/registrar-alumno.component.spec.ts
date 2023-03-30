import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarAlumnoComponent } from './registrar-alumno.component';

describe('RegistrarAlumnoComponent', () => {
  let component: RegistrarAlumnoComponent;
  let fixture: ComponentFixture<RegistrarAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarAlumnoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
