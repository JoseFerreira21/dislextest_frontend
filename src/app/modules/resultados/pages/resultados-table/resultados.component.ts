import { Component, OnInit } from '@angular/core';
import { ResultadoTestService } from '@services/resultadotest.service';
import { GlobalService } from '@services/global.service';
import { DataSourceResultados } from './data-source';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DetallesEjercicioComponent } from 'src/app/modules/layout/components/dialogs/detalles-ejercicio/detalles-ejercicio.component'; 

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
})
export class ResultadosComponent implements OnInit {
  resultados: any[] = [];  // Cambiamos a un array para facilitar el filtrado
  filteredResultados: any[] = []; // Resultados filtrados
  resultadosItems: [] = [];
  dataSource = new DataSourceResultados();
  filterText: string = ''; // Texto del filtro

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _resultadoTestService: ResultadoTestService,
    private globalService: GlobalService // Inyectamos GlobalService
  ) {
    this.obtenerResultados();
  }

  obtenerResultados() {
    this.globalService.getProfesorId().subscribe(profesorId => {
      if (profesorId !== null) {
        this._resultadoTestService.getResultados(profesorId).subscribe({
          next: (data) => {
            this.resultados = data;
            this.filteredResultados = data; // Inicialmente, todos los resultados están en la lista filtrada
          },
          error: (e) => {
            console.error('Error al obtener los resultados:', e);
          },
        });
      } else {
        console.error('No se pudo obtener el ID del profesor.');
      }
    });
  }

  // Método para filtrar los resultados
  filterResultados() {
    if (!this.filterText) {
      this.filteredResultados = this.resultados; // Si no hay filtro, mostrar todos
    } else {
      this.filteredResultados = this.resultados.filter(resultado =>
        resultado.nombre_alumno.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }
  }

  mostrarDetalles(alumnoId: number, itemId: number): void {
    const dialogRef = this.dialog.open(DetallesEjercicioComponent, {
      width: '400px',
      data: { alumnoId: alumnoId, itemId: itemId }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // Nueva función para generar el reporte
  generateReport() {
    this.router.navigate(['/report'], { state: { data: this.filteredResultados } });
  }


  ngOnInit(): void {}
}
