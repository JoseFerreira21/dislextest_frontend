import { ComponentFactoryResolver, ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminComponentesService {
  constructor() {}

  cargarEjercicios(viewContainerRef: ViewContainerRef, component: Type<any>) {
    // Limpiar el contenedor antes de cargar un nuevo componente
    viewContainerRef.clear();

    // Crear el componente en el contenedor
    viewContainerRef.createComponent(component);
  }
}