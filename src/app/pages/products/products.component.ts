import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from 'src/app/core/services/product.service';
import { TransactionService, Transaction } from 'src/app/core/services/transaction.service';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, SidebarComponent],
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

  confirmer(product: Product) {
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
        alert(`${product.name} ajouté à l'historique !`);
      },
      error: (err) => console.error('Erreur ajout transaction', err)
    });
  }

  confirmerTout() {
    const lignesSelectionnees = this.products.filter(
      p => p.availability && this.quantities[p.id] > 0
    );
    if (lignesSelectionnees.length === 0) {
      alert('Aucun produit sélectionné.');
      return;
    }
    lignesSelectionnees.forEach(p => this.confirmer(p));
  }
}