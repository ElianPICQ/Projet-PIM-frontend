import { Component, HostBinding } from '@angular/core';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { HeaderComponent } from "src/app/shared/header/header.component";
import { StockService } from 'src/app/core/services/stock.service';
import { StockProduct } from 'src/app/core/interfaces/productsInterface';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-stocks',
  imports: [SidebarComponent, HeaderComponent, MatTableModule],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  stocks: StockProduct[] = [];
  displayedColumns: string[] = ['original_product_id', 'name', 'category', 'quantity', 'price', 'discount', 'supplier', 'comments'];

  constructor(
    private readonly sidebarStateService: SidebarStateService,
    private readonly stockService: StockService
  ) {}

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.sidebarStateService.isCollapsed ? 50 : 180;
  }

  ngOnInit() {
    this.stockService.getStock().subscribe({
      next: (data) => {
        this.stocks = data;
        console.log(this.stocks);
      },
      error: (err) => console.error('Erreur chargement stocks', err)
    });
  }
}
