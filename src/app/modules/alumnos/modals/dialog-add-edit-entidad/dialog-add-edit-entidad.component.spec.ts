import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddEditEntidadComponent } from './dialog-add-edit-entidad.component';

describe('DialogAddEditEntidadComponent', () => {
  let component: DialogAddEditEntidadComponent;
  let fixture: ComponentFixture<DialogAddEditEntidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddEditEntidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddEditEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
