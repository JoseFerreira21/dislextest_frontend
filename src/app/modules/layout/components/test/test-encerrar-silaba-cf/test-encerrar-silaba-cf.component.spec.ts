import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEncerrarSilabaCfComponent } from './test-encerrar-silaba-cf.component';

describe('TestEncerrarSilabaCfComponent', () => {
  let component: TestEncerrarSilabaCfComponent;
  let fixture: ComponentFixture<TestEncerrarSilabaCfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestEncerrarSilabaCfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEncerrarSilabaCfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
