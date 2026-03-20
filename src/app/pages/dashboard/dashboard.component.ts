import { Component, ElementRef, HostBinding, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);
import { DashboardData } from 'src/app/core/interfaces/dashboardInterface';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { IconPrimaryComponent } from 'src/app/shared/icon-primary/icon-primary.component';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent, IconPrimaryComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  dashboardData!: DashboardData;

  constructor(
    private readonly sidebarStateService: SidebarStateService,
    private readonly dashboardService: DashboardService
  ) {}

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.sidebarStateService.isCollapsed ? 50 : 180;
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        setTimeout(() => this.renderChart());
      },
      error: (err) => console.error('Erreur chargement dashboard', err)
    });
  }

  renderChart(): void {
    if (!this.salesChartRef) {
      setTimeout(() => this.renderChart());
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }
    const labels = this.dashboardData.ventes_par_jour.map(v => v.date);
    const values = this.dashboardData.ventes_par_jour.map(v => v.value);
    this.chart = new Chart(this.salesChartRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Chiffre d\'affaires',
          data: values,
          borderColor: '#FC9100',
          backgroundColor: 'rgba(0, 48, 81, 0.1)',
          pointBackgroundColor: '#003051',
          tension: 0.3,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => `${item.formattedValue}€`
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Ventes (€)' }, beginAtZero: true }
        }
      }
    });
  }

  getProductInStock(): string {
    const inStock = this.dashboardData.total_products - this.dashboardData.out_of_stock;
    return inStock.toString();
  }
}
