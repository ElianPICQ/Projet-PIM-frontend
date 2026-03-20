import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { ModalComponent, ModalItem } from 'src/app/shared/modal/modal.component';
import { Product, ProductPageProduct } from 'src/app/core/interfaces/productsInterface';
import { StockService } from 'src/app/core/services/stock.service';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, SidebarComponent, CommonModule, FormsModule, ModalComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  SelectedProducts: ProductPageProduct[] = [];

  categoryLabels: { [key: number]: string } = {
    0: 'Poissons',
    1: 'Coquillages',
    2: 'Crustacés'
  };

  // Modal
  showModal = false;
  modalMode: 'single' | 'recap' = 'single';
  modalItems: ModalItem[] = [];
  modalTitre = 'Confirmer';
  private pendingAction: (() => void) | null = null;

  constructor(
    private productService: ProductService,
    private stockService: StockService,
    private sidebarStateService: SidebarStateService
  ) {}

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.sidebarStateService.isCollapsed ? 50 : 180;
  }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => { this.products = data; },
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  increment(product: Product) {
    const selected = this.SelectedProducts.find((p) => p.original_product_id === product.id);
    if (selected) {
      selected.quantity += 1;
      return;
    }
    this.SelectedProducts.push({
      original_product_id: product.id,
      name: product.name,
      category: product.category,
      quantity: 1,
      unit: product.unit,
      price: product.price,
      discount: product.sale ? product.discount : 0,
      comments: product.comments,
      supplier: product.supplier
    });
  }

  decrement(product: Product) {
    const index = this.SelectedProducts.findIndex((p) => p.original_product_id === product.id);
    if (index === -1) return;
    const p = this.SelectedProducts[index];
    if (p.quantity === 1) {
      this.SelectedProducts.splice(index, 1);
    } else {
      p.quantity -= 1;
    }
  }

  getQuantity(id: number): number {
    return this.SelectedProducts.find((p) => p.original_product_id === id)?.quantity ?? 0;
  }

  getPrixFinal(product: Product): number {
    if (product.sale) {
      return product.price - (product.price * product.discount / 100);
    }
    return product.price;
  }

  get hasSelectedProducts(): boolean {
    return this.SelectedProducts.length > 0;
  }

  confirmer(product: Product) {
    const selected = this.SelectedProducts.find((p) => p.original_product_id === product.id);
    if (!selected) return;

    const prixFinal = this.getPrixFinal(product);
    this.modalMode = 'single';
    this.modalTitre = 'Confirmer l\'ajout';
    this.modalItems = [{
      nom: product.name,
      quantite: selected.quantity,
      unite: product.unit,
      prix: product.price,
      remise: product.sale ? product.discount : 0,
      total: Math.round(prixFinal * selected.quantity * 100) / 100
    }];
    this.pendingAction = () => this.executeConfirmer(product);
    this.showModal = true;
  }

  private executeConfirmer(product: Product) {
    const selected = this.SelectedProducts.filter((p) => p.original_product_id === product.id);
    const index = this.SelectedProducts.findIndex((p) => p.original_product_id === product.id);
    this.stockService.addStock(selected).subscribe({
      next: () => {
        this.SelectedProducts.splice(index, 1);
        this.showModal = false;
      },
      error: (err) => console.error('Erreur ajout stock', err)
    });
  }

  confirmerTout() {
    if (this.SelectedProducts.length < 1) return;

    this.modalMode = 'recap';
    this.modalTitre = 'Confirmer tout';
    this.modalItems = this.SelectedProducts.map(p => {
      const product = this.products.find(pr => pr.id === p.original_product_id);
      const prixFinal = product ? this.getPrixFinal(product) : p.price;
      return {
        nom: p.name,
        quantite: p.quantity,
        unite: p.unit,
        prix: Math.round(prixFinal * 100) / 100,
        remise: p.discount,
        total: Math.round(prixFinal * p.quantity * 100) / 100
      };
    });
    this.pendingAction = () => this.executeConfirmerTout();
    this.showModal = true;
  }

  private executeConfirmerTout() {
    this.stockService.addStock(this.SelectedProducts).subscribe({
      next: () => {
        this.SelectedProducts = [];
        this.showModal = false;
      },
      error: (err) => console.error('Erreur ajout produits au stock', err)
    });
  }

  onModalConfirm() {
    if (this.pendingAction) this.pendingAction();
  }

  onModalCancel() {
    this.showModal = false;
    this.pendingAction = null;
  }
}