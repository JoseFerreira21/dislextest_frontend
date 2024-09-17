import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  resultados: any[] = [];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.resultados = navigation?.extras?.state?.data || [];
  }

  ngOnInit(): void {
    setTimeout(() => {
      window.print();
    }, 1000);
  }
}