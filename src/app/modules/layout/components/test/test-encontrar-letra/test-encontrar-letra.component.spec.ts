import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEncontrarLetraComponent } from './test-encontrar-letra.component';

describe('TestEncontrarLetraComponent', () => {
  let component: TestEncontrarLetraComponent;
  let fixture: ComponentFixture<TestEncontrarLetraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestEncontrarLetraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEncontrarLetraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
