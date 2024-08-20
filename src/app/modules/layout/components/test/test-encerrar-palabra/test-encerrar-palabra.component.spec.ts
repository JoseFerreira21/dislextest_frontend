import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEncerrarPalabraComponent } from './test-encerrar-palabra.component';

describe('TestEncerrarPalabraComponent', () => {
  let component: TestEncerrarPalabraComponent;
  let fixture: ComponentFixture<TestEncerrarPalabraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestEncerrarPalabraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEncerrarPalabraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
