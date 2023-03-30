import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResultadoTest } from '@models/resultadotest.model';

export class DataSourceResultados extends DataSource<ResultadoTest> {

  data = new BehaviorSubject<ResultadoTest[]>([]);
  originalData: ResultadoTest[]= [];

  connect(): Observable<ResultadoTest[]> {
    return this.data;
  }

  init(data: ResultadoTest[]) {
    this.originalData = data;
    this.data.next(data);
  }

  disconnect() { }

}
