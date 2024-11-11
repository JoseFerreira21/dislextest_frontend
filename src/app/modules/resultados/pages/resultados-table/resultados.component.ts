import { Component, OnInit } from '@angular/core';
import { ResultadoTestService } from '@services/resultadotest.service';
import { GlobalService } from '@services/global.service';
import { DataSourceResultados } from './data-source';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DetallesEjercicioComponent } from 'src/app/modules/layout/components/dialogs/detalles-ejercicio/detalles-ejercicio.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    MatInputModule
  ],
  
})
export class ResultadosComponent implements OnInit {
  resultados: any[] = [];  // Cambiamos a un array para facilitar el filtrado
  filteredResultados: any[] = []; // Resultados filtrados
  resultadosItems: [] = [];
  dataSource = new DataSourceResultados();
  filterText: string = ''; // Texto del filtro
  
  instituciones: string[] = [];
  grados: string[] = [];
  sexos: string[] = ['M', 'F'];
  institucionSeleccionada: string | null = null;
  gradoSeleccionado: string | null = null;
  sexoSeleccionado: string | null = null;
  indicadores: string[] = ['Riesgo', 'Sin Riesgo'];
  indicadorSeleccionado: string | null = null;

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
            this.filteredResultados = data;
            
            // Extraer instituciones y grados únicos
            this.instituciones = Array.from(new Set(data.map(item => item.institucion)));
            this.grados = Array.from(new Set(data.map(item => item.grado)));
            this.indicadores = Array.from(new Set(data.map(item => item.indicador)));
          },
          error: (e) => console.error('Error al obtener los resultados:', e),
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

  applyFilter() {
    this.filteredResultados = this.resultados.filter((resultado) => {
      const matchesInstitucion = this.institucionSeleccionada ? resultado.institucion === this.institucionSeleccionada : true;
      const matchesGrado = this.gradoSeleccionado ? resultado.grado === this.gradoSeleccionado : true;
      const matchesSexo = this.sexoSeleccionado ? resultado.sexo === this.sexoSeleccionado : true;
      const matchesNombre = this.filterText ? resultado.nombre_alumno.toLowerCase().includes(this.filterText.toLowerCase()) : true;
      const matchesIndicador = this.indicadorSeleccionado ? resultado.indicador === this.indicadorSeleccionado : true;
  
      return matchesInstitucion && matchesGrado && matchesSexo && matchesNombre && matchesIndicador;
    });
  }

  limpiarFiltros() {
    this.institucionSeleccionada = null;
    this.gradoSeleccionado = null;
    this.sexoSeleccionado = null;
    this.indicadorSeleccionado = null;
    this.filterText = '';  // Restablece el filtro de texto también
    
    // Restablece la lista filtrada a todos los resultados
    this.applyFilter();
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
