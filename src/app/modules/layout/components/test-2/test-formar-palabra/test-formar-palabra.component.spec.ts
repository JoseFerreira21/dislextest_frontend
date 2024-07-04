import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFormarPalabraComponent } from './test-formar-palabra.component';

describe('TestFormarPalabraComponent', () => {
  let component: TestFormarPalabraComponent;
  let fixture: ComponentFixture<TestFormarPalabraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestFormarPalabraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestFormarPalabraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
