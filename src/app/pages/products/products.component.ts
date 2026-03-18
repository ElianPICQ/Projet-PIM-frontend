import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from 'src/app/core/services/product.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, SidebarComponent, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];

  categoryLabels: { [key: number]: string } = { 
    0: 'Poissons',
    1: 'Coquillages',
    2: 'Crustacés'
  };

  // Quantités par produit (clé = id du produit)
  quantities: { [id: number]: number } = {};

  // Modal
  showModal = false;
  selectedProduct: Product | null = null;
  purchasePrice: number | null = null;
  hasPromo = false;
  discountAmount: number = 0;

  get finalPrice(): number {
    if (!this.purchasePrice) return 0;
    if (this.hasPromo) return this.purchasePrice - (this.purchasePrice * this.discountAmount / 100);
    return this.purchasePrice;
  }

  constructor(
    private productService: ProductService,
    private readonly sidebarStateService: SidebarStateService
  ) {}

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.sidebarStateService.isCollapsed ? 50 : 180;
  }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        // Initialise toutes les quantités à 1
        data.forEach(p => this.quantities[p.id] = 1);
      },
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  increment(product: Product) {
    this.quantities[product.id]++;
  }

  decrement(product: Product) {
    if (this.quantities[product.id] > 1) {
      this.quantities[product.id]--;
    }
  }

  openModal(product: Product) {
    this.selectedProduct = product;
    this.purchasePrice = null;
    this.hasPromo = false;
    this.discountAmount = 0;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }

  confirmAddStock() {
    if (!this.selectedProduct || !this.purchasePrice) return;

    const payload = {
      productId: this.selectedProduct.id,
      quantity: this.quantities[this.selectedProduct.id],
      purchasePrice: this.purchasePrice,
      sale: this.hasPromo,
      discount: this.hasPromo ? this.discountAmount : 0,
      finalPrice: this.finalPrice
    };

    console.log('Ajout au stock :', payload);
    this.closeModal();
  }
}