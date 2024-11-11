import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestContarLetrasComponent } from './test-contar-letras.component';

describe('TestContarLetrasComponent', () => {
  let component: TestContarLetrasComponent;
  let fixture: ComponentFixture<TestContarLetrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestContarLetrasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestContarLetrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
