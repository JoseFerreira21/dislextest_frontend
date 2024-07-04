import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTacharPalabraComponent } from './test-tachar-palabra.component';

describe('TestTacharPalabraComponent', () => {
  let component: TestTacharPalabraComponent;
  let fixture: ComponentFixture<TestTacharPalabraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestTacharPalabraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTacharPalabraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
