import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLetrasDesordenadasComponent } from './test-letras-desordenadas.component';

describe('TestLetrasDesordenadasComponent', () => {
  let component: TestLetrasDesordenadasComponent;
  let fixture: ComponentFixture<TestLetrasDesordenadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestLetrasDesordenadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestLetrasDesordenadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
