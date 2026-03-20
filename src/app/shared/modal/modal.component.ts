import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ModalProduct {
  nom: string;
  quantite: number;
  unite: string;
  prixAvantPromo: number;
  remise: number;
  prixUnitaire: number;
  total: number;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() mode: 'single' | 'recap' = 'single';
  @Input() products: ModalProduct[] = [];
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get grandTotal(): number {
    return Math.round(this.products.reduce((sum, p) => sum + p.total, 0) * 100) / 100;
  }
}