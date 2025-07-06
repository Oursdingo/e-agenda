import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartType, Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// Enregistrement des composants nécessaires pour le camembert
Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="stats-container">
      <h2>Statistiques Livres / Auteurs</h2>
      <canvas baseChart
        [data]="pieChartData"
        [type]="pieChartType"
        [options]="pieChartOptions">
      </canvas>
    </div>
  `,
  styles: [
    `.stats-container {
      max-width: 600px;
      margin: 2rem auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(58,123,213,0.08);
      padding: 2rem;
      text-align: center;
    }
    h2 { color: #3a7bd5; margin-bottom: 2rem; }
    `
  ]
})
export class StatistiquesComponent implements OnInit {
  pieChartType: ChartType = 'pie';
  pieChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{ data: [] }]
  };
  pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const }
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8082/api/books/stats').subscribe(stats => {
      console.log('Stats reçues:', stats);
      this.pieChartData = {
        labels: stats.map(s => s.auteur),
        datasets: [{
          data: stats.map(s => s.nombreLivres),
          backgroundColor: [
            '#3a7bd5', '#00d2ff', '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'
          ]
        }]
      };
    });
  }
}