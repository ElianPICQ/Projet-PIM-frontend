import { Component, HostBinding, OnInit } from '@angular/core';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { ModalComponent, ModalItem } from 'src/app/shared/modal/modal.component';
import { StockService } from 'src/app/core/services/stock.service';
import { StockPageProduct, StockProductToUpdate } from 'src/app/core/interfaces/productsInterface';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stocks',
  imports: [CommonModule, SidebarComponent, HeaderComponent, MatTableModule, MatFormFieldModule, MatSelectModule, ModalComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent implements OnInit {

  stocks: StockPageProduct[] = [];
  selectedOperations: Record<number, 'Achat' | 'Vente' | 'Invendu'> = {};
  displayedColumns: string[] = ['category', 'name', 'supplier', 'quantity', 'price', 'discount', 'comments', 'operation', 'delete'];

  productsToUpdate: StockProductToUpdate[] = [];
  productsToAdd: StockProductToUpdate[] = [];
  productsToRemove: StockProductToUpdate[] = [];

  // Modal
  showModal = false;
  modalMode: 'single' | 'recap' = 'single';
  modalItems: ModalItem[] = [];
  modalTitre = 'Confirmer';
  private pendingAction: (() => void) | null = null;

  constructor(
    private readonly sidebarStateService: SidebarStateService,
    private readonly stockService: StockService
  ) {}

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.sidebarStateService.isCollapsed ? 50 : 180;
  }

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.stockService.getStock().subscribe({
      next: (data) => {
        this.stocks = data;
        this.stocks.forEach((item) => {
          if (!this.selectedOperations[item.id]) {
            this.selectedOperations[item.id] = 'Achat';
          }
        });
      },
      error: (err) => console.error('Erreur chargement stocks', err)
    });
  }

  onOperationChange(product: StockPageProduct, operation: StockProductToUpdate['operation']) {
    this.selectedOperations[product.id] = operation;
    const selected = this.productsToUpdate.find((p) => p.id === product.id);
    if (selected) selected.operation = operation;
  }

  decrement(product: StockPageProduct) {
    const index = this.productsToUpdate.findIndex((p) => p.id === product.id);
    if (index === -1) return;
    const selected = this.productsToUpdate[index];
    if (selected.quantity === 1) {
      this.productsToUpdate.splice(index, 1);
    } else {
      selected.quantity -= 1;
    }
  }

  increment(product: StockPageProduct) {
    const selected = this.productsToUpdate.find((p) => p.id === product.id);
    if (selected) {
      selected.quantity += 1;
      return;
    }
    this.productsToUpdate.push({
      id: product.id,
      original_product_id: product.original_product_id,
      name: product.name,
      category: product.category,
      quantity: 1,
      unit: product.unit,
      price: product.price,
      discount: product.discount,
      comments: product.comments,
      supplier: product.supplier,
      operation: this.selectedOperations[product.id]
    });
  }

  getQuantity(id: number): number {
    return this.productsToUpdate.find((p) => p.id === id)?.quantity ?? 0;
  }

  confirmer(product: StockPageProduct) {
    const selected = this.productsToUpdate.find((p) => p.id === product.id);
    if (!selected) return;

    this.modalMode = 'single';
    this.modalTitre = 'Confirmer l\'opération';
    this.modalItems = [{
      nom: product.name,
      quantite: selected.quantity,
      unite: product.unit,
      operation: selected.operation
    }];
    this.pendingAction = () => this.executeConfirmer(product);
    this.showModal = true;
  }

  private executeConfirmer(product: StockPageProduct) {
    const selected = this.productsToUpdate.filter((p) => p.id === product.id);
    const index = this.productsToUpdate.findIndex((p) => p.id === product.id);

    if (selected[0].operation === 'Achat') {
      this.stockService.addStock(selected).subscribe({
        next: () => {
          this.productsToUpdate.splice(index, 1);
          this.loadStocks();
          this.showModal = false;
        },
        error: (err) => console.error('Erreur ajout stock', err)
      });
    } else {
      if (selected[0].quantity > product.quantity) {
        alert('La quantité à retirer ne peut pas être supérieure à la quantité en stock.');
        this.showModal = false;
        return;
      }
      this.stockService.removeStock(selected).subscribe({
        next: () => {
          this.productsToUpdate.splice(index, 1);
          this.loadStocks();
          this.showModal = false;
        },
        error: (err) => console.error('Erreur retrait stock', err)
      });
    }
  }

  confirmerTout() {
    if (this.productsToUpdate.length === 0) {
      alert('Aucune modification à confirmer.');
      return;
    }

    for (const p of this.productsToUpdate.filter(p => p.operation !== 'Achat')) {
      const stock = this.stocks.find(s => s.id === p.id);
      if (stock && p.quantity > stock.quantity) {
        alert(`${p.name} — quantité à retirer supérieure au stock disponible.`);
        return;
      }
    }

    this.modalMode = 'recap';
    this.modalTitre = 'Confirmer tout';
    this.modalItems = this.productsToUpdate.map(p => ({
      nom: p.name,
      quantite: p.quantity,
      unite: p.unit,
      operation: p.operation
    }));
    this.pendingAction = () => this.executeConfirmerTout();
    this.showModal = true;
  }

  private executeConfirmerTout() {
    this.productsToAdd = this.productsToUpdate.filter(p => p.operation === 'Achat');
    this.productsToRemove = this.productsToUpdate.filter(p => p.operation === 'Vente' || p.operation === 'Invendu');

    const requests = [];
    if (this.productsToAdd.length > 0) requests.push(this.stockService.addStock(this.productsToAdd));
    if (this.productsToRemove.length > 0) requests.push(this.stockService.removeStock(this.productsToRemove));

    forkJoin(requests).subscribe({
      next: () => {
        this.productsToAdd = [];
        this.productsToRemove = [];
        this.productsToUpdate = [];
        this.loadStocks();
        this.showModal = false;
      },
      error: (err) => console.error('Erreur confirmation globale', err)
    });
  }

  onModalConfirm() {
    if (this.pendingAction) this.pendingAction();
  }

  onModalCancel() {
    this.showModal = false;
    this.pendingAction = null;
  }

  delete(product: StockPageProduct) {
    this.stockService.deleteStock(product.id).subscribe({
      next: () => this.loadStocks(),
      error: (err) => console.error('Erreur suppression stock', err)
    });
  }
}