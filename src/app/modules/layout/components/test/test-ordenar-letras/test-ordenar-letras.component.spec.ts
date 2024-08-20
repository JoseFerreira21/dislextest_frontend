import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestOrdenarLetrasComponent } from './test-ordenar-letras.component';

describe('TestOrdenarLetrasComponent', () => {
  let component: TestOrdenarLetrasComponent;
  let fixture: ComponentFixture<TestOrdenarLetrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestOrdenarLetrasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestOrdenarLetrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
