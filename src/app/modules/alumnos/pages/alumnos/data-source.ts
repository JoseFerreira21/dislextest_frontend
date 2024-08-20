import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alumnos } from '@models/alumnos.model';

export class DataSourceUser extends DataSource<Alumnos> {

  data = new BehaviorSubject<Alumnos[]>([]);
  originalData: Alumnos[]= [];

  connect(): Observable<Alumnos[]> {
    return this.data;
  }

  init(data: Alumnos[]) {
    this.originalData = data;
    this.data.next(data);
  }

  disconnect() { }

}
