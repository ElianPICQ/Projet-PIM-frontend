import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ModalItem {
  nom: string;
  quantite: number;
  unite: string;
  prix?: number;
  remise?: number;
  total?: number;
  operation?: string;
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
  @Input() items: ModalItem[] = [];
  @Input() titre: string = 'Confirmer';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get grandTotal(): number {
    return Math.round(this.items.reduce((sum, i) => sum + (i.total ?? 0), 0) * 100) / 100;
  }

  get showPrix(): boolean {
    return this.items.some(i => i.prix !== undefined);
  }

  get showOperation(): boolean {
    return this.items.some(i => i.operation !== undefined);
  }
}