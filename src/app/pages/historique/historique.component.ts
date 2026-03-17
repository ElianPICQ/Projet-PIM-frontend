import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { TransactionService, Transaction } from 'src/app/core/services/transaction.service';

@Component({
  selector: 'app-historique',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent implements OnInit {

  transactions: Transaction[] = [];

  constructor(
    private readonly sidebarStateService: SidebarStateService,
    private readonly transactionService: TransactionService
  ) {}

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.sidebarStateService.isCollapsed ? 50 : 180;
  }

  ngOnInit() {
    this.transactionService.getTransactions().subscribe({
      next: (data) => this.transactions = data,
      error: (err) => console.error('Erreur chargement historique', err)
    });
  }
}