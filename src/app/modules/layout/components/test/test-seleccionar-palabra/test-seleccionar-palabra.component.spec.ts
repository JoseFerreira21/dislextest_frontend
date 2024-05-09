import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSeleccionarPalabraComponent } from './test-seleccionar-palabra.component';

describe('TestSeleccionarPalabraComponent', () => {
  let component: TestSeleccionarPalabraComponent;
  let fixture: ComponentFixture<TestSeleccionarPalabraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSeleccionarPalabraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSeleccionarPalabraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
