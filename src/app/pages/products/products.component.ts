import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from 'src/app/core/services/product.service';
import { TransactionService, Transaction } from 'src/app/core/services/transaction.service';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { ModalComponent, ModalProduct } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, SidebarComponent, ModalComponent],
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
  quantities: { [id: number]: number } = {};

  // Modal
  showModal = false;
  modalMode: 'single' | 'recap' = 'single';
  modalProducts: ModalProduct[] = [];
  pendingProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        data.forEach(p => this.quantities[p.id] = 0);
      },
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  increment(product: Product) {
    this.quantities[product.id]++;
  }

  decrement(product: Product) {
    if (this.quantities[product.id] > 0) {
      this.quantities[product.id]--;
    }
  }

  getPrixFinal(product: Product): number {
    if (product.sale) {
      return product.price - (product.price * product.discount / 100);
    }
    return product.price;
  }

  buildModalProduct(product: Product): ModalProduct {
    const prixFinal = this.getPrixFinal(product);
    return {
      nom: product.name,
      quantite: this.quantities[product.id],
      unite: product.unit,
      prixAvantPromo: product.price,
      remise: product.sale ? product.discount : 0,
      prixUnitaire: Math.round(prixFinal * 100) / 100,
      total: Math.round(prixFinal * this.quantities[product.id] * 100) / 100
    };
  }

  // Ouvre la modal pour un seul produit
  ouvrirModalSingle(product: Product) {
    this.modalMode = 'single';
    this.modalProducts = [this.buildModalProduct(product)];
    this.pendingProducts = [product];
    this.showModal = true;
  }

  // Ouvre la modal récap pour tout confirmer
  ouvrirModalRecap() {
    const lignesSelectionnees = this.products.filter(
      p => p.availability && this.quantities[p.id] > 0
    );
    if (lignesSelectionnees.length === 0) {
      alert('Aucun produit sélectionné.');
      return;
    }
    this.modalMode = 'recap';
    this.modalProducts = lignesSelectionnees.map(p => this.buildModalProduct(p));
    this.pendingProducts = lignesSelectionnees;
    this.showModal = true;
  }

  get hasSelectedProducts(): boolean {
  return this.products.some(p => p.availability && this.quantities[p.id] > 0);
}

  // Appelé quand on clique Confirmer dans la modal
  onModalConfirm() {
    this.pendingProducts.forEach(product => {
      const prixFinal = this.getPrixFinal(product);
      const transaction: Transaction = {
        nom: product.name,
        type_mouvement: 'Achat',
        quantite: this.quantities[product.id],
        categorie: this.categoryLabels[product.category],
        prix_avant_promo: product.price,
        remise: product.sale ? product.discount : 0,
        prix_unitaire: Math.round(prixFinal * 100) / 100,
        total: Math.round(prixFinal * this.quantities[product.id] * 100) / 100
      };

      this.transactionService.addTransaction(transaction).subscribe({
        next: () => {
          this.quantities[product.id] = 0;
        },
        error: (err) => console.error('Erreur ajout transaction', err)
      });
    });

    this.showModal = false;
    alert('Stock mis à jour !');
  }

  onModalCancel() {
    this.showModal = false;
  }
}