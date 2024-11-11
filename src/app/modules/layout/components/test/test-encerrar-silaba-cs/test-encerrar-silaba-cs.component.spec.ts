import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEncerrarSilabaCsComponent } from './test-encerrar-silaba-cs.component';

describe('TestEncerrarSilabaCsComponent', () => {
  let component: TestEncerrarSilabaCsComponent;
  let fixture: ComponentFixture<TestEncerrarSilabaCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestEncerrarSilabaCsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEncerrarSilabaCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
