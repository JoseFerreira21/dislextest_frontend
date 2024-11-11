import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestIzquierdaDerechaComponent } from './test-izquierda-derecha.component';

describe('TestIzquierdaDerechaComponent', () => {
  let component: TestIzquierdaDerechaComponent;
  let fixture: ComponentFixture<TestIzquierdaDerechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestIzquierdaDerechaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestIzquierdaDerechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
