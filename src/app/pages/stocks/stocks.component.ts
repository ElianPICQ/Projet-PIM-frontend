import { Component, HostBinding } from '@angular/core';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { HeaderComponent } from "src/app/shared/header/header.component";
import { StockService } from 'src/app/core/services/stock.service';
import { StockPageProduct, StockProductToUpdate } from 'src/app/core/interfaces/productsInterface';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stocks',
  imports: [CommonModule, SidebarComponent, HeaderComponent, MatTableModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  stocks: StockPageProduct[] = [];
  productsFiltered: StockPageProduct[] = [];
  selectedOperations: Record<number, 'Achat' | 'Vente' | 'Invendu'> = {};
  displayedColumns: string[] = ['category', 'name', 'supplier', 'quantity', 'price', 'sellPrice', 'discount', 'finalSellPrice', 'margin', 'comments', 'operation', 'delete'];
  private basicUnits: string[] = ['kg', 'pièce', 'Dz'];

  sellPrice: number = 0;
  finalSellPrice: number = 0;

  filterCategory: -1 | 0 | 1 | 2 = -1;

  categoryLabels: { [key: number]: string } = {
    0: 'Poissons',
    1: 'Coquillages',
    2: 'Crustacés'
  };

  productsToUpdate: StockProductToUpdate[] = [];
  productsToAdd: StockProductToUpdate[] = [];
  productsToRemove: StockProductToUpdate[] = [];

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
        this.stocks.forEach(stock => {
          stock.sellPrice = stock.price;
          stock.finalSellPrice = stock.price;
        });
        this.onFilterCategoryChange(this.filterCategory);
        this.stocks.forEach((item) => {
          if (!this.selectedOperations[item.id]) {
            this.selectedOperations[item.id] = 'Achat';
          }
        });
        console.log(this.stocks);
      },
      error: (err) => console.error('Erreur chargement stocks', err)
    });
  }

  onFilterCategoryChange(category: number) {
    if (category === -1) {
      this.productsFiltered = this.stocks;
    } else {
      this.productsFiltered = this.stocks.filter(p => +p.category === category);
    }
    console.log(this.productsFiltered)
  }

  displayMultiplySymbol(unit: string) {
    return !this.basicUnits.includes(unit);
  }

  onOperationChange(product: StockPageProduct, operation: StockProductToUpdate['operation']) {
    this.selectedOperations[product.id] = operation;

    const selectedProduct = this.productsToUpdate.find((p) => p.id === product.id);
    if (!selectedProduct) {
      return ;
    }

    selectedProduct.operation = operation;
  }

  updateFinalPrice(product: StockPageProduct) {
    product.finalSellPrice = Math.round(product.sellPrice * (1 - product.discount) * 100) / 100;
  }
  
  decrement(product: StockPageProduct) {
    const selectedProductIndex = this.productsToUpdate.findIndex((p) => p.id === product.id);
    if (selectedProductIndex === -1) {
      return ;
    }

    const selectedProduct = this.productsToUpdate[selectedProductIndex];
    if (selectedProduct.quantity === 1) {
      this.productsToUpdate.splice(selectedProductIndex, 1);
    } else {
      selectedProduct.quantity -= 1;
    }
  }
  
  increment(product: StockPageProduct) {
    const selectedProduct = this.productsToUpdate.find((p) => p.id === product.id);
    if (selectedProduct) {
      selectedProduct.quantity += 1;
      return;
    }

    this.productsToUpdate.push({
      id: product.id,
      original_product_id: product.original_product_id,
      name: product.name,
      category: product.category,
      quantity: 1,
      unit: product.unit,
      price: this.selectedOperations[product.id] === 'Vente' ? product.finalSellPrice : product.price,
      discount: product.discount,
      comments: product.comments,
      supplier: product.supplier,
      operation: this.selectedOperations[product.id]
    });
  }

  getQuantity(id: number): number {
    const selectedProduct = this.productsToUpdate.find((p) => p.id === id);
    if (!selectedProduct)
      return 0;

    return selectedProduct.quantity;
  }
  
  confirmer(product: StockPageProduct) {
    const selectedProduct = this.productsToUpdate.filter((p) => p.id === product.id);
    const indexProduct = this.productsToUpdate.findIndex((p) => p.id === product.id);
    if (selectedProduct.length !== 1 || indexProduct === -1)
    {
      alert('erreur');
      return ;
    }

    if (selectedProduct[0].operation === 'Achat') {
      this.stockService.addStock(selectedProduct).subscribe({
        next: () => {
          this.productsToUpdate.splice(indexProduct, 1);
          this.loadStocks();

          alert(`${product.name} ajouté au stock !`);
        },
        error: (err) => console.error('Erreur ajout stock', err)
      });
    }

    else if (selectedProduct[0].operation === 'Vente' || selectedProduct[0].operation === 'Invendu') {

      if (selectedProduct[0].quantity > product.quantity) {
        alert('La quantité à retirer ne peut pas être supérieure à la quantité en stock.');
        return ;
      }

      this.stockService.removeStock(selectedProduct).subscribe({
        next: () => {
          this.productsToUpdate.splice(indexProduct, 1);
          this.loadStocks();

          alert(`${product.name} retiré du stock !`);
        },
        error: (err) => console.error('Erreur retrait stock', err)
      });
    }
  }

  confirmerTout() {
    this.productsToAdd = this.productsToUpdate.filter((p) => p.operation === 'Achat');
    this.productsToRemove = this.productsToUpdate.filter(
      (p) => p.operation === 'Vente' || p.operation === 'Invendu'
    );

    for (const product of this.productsToRemove) {
      if (product.quantity > this.stocks.find((p) => p.id === product.id)?.quantity!) {
        alert(`Produit : ${product.name} - La quantité à retirer ne peut pas être supérieure à la quantité en stock.`);
        return ;
      }
    }

    const requests = [];
    if (this.productsToAdd.length > 0) {
      requests.push(this.stockService.addStock(this.productsToAdd));
    }
    if (this.productsToRemove.length > 0) {
      requests.push(this.stockService.removeStock(this.productsToRemove));
    }

    if (requests.length === 0) {
      alert('Aucune modification à confirmer.');
      return;
    }

    forkJoin(requests).subscribe({
      next: () => {
        this.productsToAdd = [];
        this.productsToRemove = [];
        this.productsToUpdate = [];
        this.loadStocks();

        alert('Les modifications ont été confirmées.');
      },
      error: (err) => {
        console.error('Erreur confirmation globale', err);
      }
    });
  }

  delete(product: StockPageProduct) {

    this.stockService.deleteStock(product.id).subscribe({
      next: () => {
        this.loadStocks();

        alert(`${product.name} retiré du stock !`);
      },
      error: (err) => console.error('Erreur retrait stock', err)
    });
  }
}
