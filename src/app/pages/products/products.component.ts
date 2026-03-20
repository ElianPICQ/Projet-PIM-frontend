import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { Product, ProductPageProduct } from 'src/app/core/interfaces/productsInterface';
import { StockService } from 'src/app/core/services/stock.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, SidebarComponent, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  productsFiltered: Product[] = [];
  SelectedProducts: ProductPageProduct[] = [];
  
  filterCategory: -1 | 0 | 1 | 2 = -1;

  categoryLabels: { [key: number]: string } = {
    0: 'Poissons',
    1: 'Coquillages',
    2: 'Crustacés'
  };

  quantities: { [id: number]: number } = {};

  constructor(
    private productService: ProductService,
    private stockService: StockService,
    private sidebarStateService: SidebarStateService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.onFilterCategoryChange(this.filterCategory);
      },
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.sidebarStateService.isCollapsed ? 50 : 180;
  }

  onFilterCategoryChange(category: number) {
    if (category === -1) {
      this.productsFiltered = this.products;
    } else {
      this.productsFiltered = this.products.filter(p => p.category === category);
    }
    console.log(this.productsFiltered)
  }

  increment(product: Product) {
    const selectedProduct = this.SelectedProducts.find((p) => p.original_product_id === product.id);
    if (selectedProduct) {
      selectedProduct.quantity += 1;
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
    const selectedProductIndex = this.SelectedProducts.findIndex((p) => p.original_product_id === product.id);
    if (selectedProductIndex === -1) {
      return;
    }

    const selectedProduct = this.SelectedProducts[selectedProductIndex];
    if (selectedProduct.quantity === 1) {
      this.SelectedProducts.splice(selectedProductIndex, 1);
    } else {
      selectedProduct.quantity -= 1;
    }
  }

  getQuantity(id: number): number {
    const selectedProduct = this.SelectedProducts.find((p) => p.original_product_id === id);
    if (!selectedProduct)
      return 0;

    return selectedProduct.quantity;
  }

  getPrixFinal(product: Product): number {
    if (product.sale) {
      return product.price - (product.price * product.discount / 100);
    }
    return product.price;
  }

  confirmer(product: Product) {
    const selectedProduct = this.SelectedProducts.filter((p) => p.original_product_id === product.id);
    const indexProduct = this.SelectedProducts.findIndex((p) => p.original_product_id === product.id);
    if (selectedProduct.length !== 1 || indexProduct === -1)
    {
      alert('erreur');
      return ;
    }

    this.stockService.addStock(selectedProduct).subscribe({
      next: () => {
        this.SelectedProducts.splice(indexProduct, 1);

        alert(`${product.name} ajouté au stock !`);
      },
      error: (err) => console.error('Erreur ajout stock', err)
    });
  }

  confirmerTout() {
    if (this.SelectedProducts.length < 1)
    {
      // erreur
      return ;
    }
    
    this.stockService.addStock(this.SelectedProducts).subscribe({
      next: () => {
        this.SelectedProducts = [];
        alert("Tous les produits ont été ajoutés au stock !");
        // AJouter modale confirmation
      },
      error: (err) => console.error('Erreur ajout produits au stock', err)
    });

  }
}