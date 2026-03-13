import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatSidenavContainer, MatSidenav, MatSidenavContent, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() activePage = '';
  @Output() collapsedChange = new EventEmitter<boolean>();
  isCollapsed = false;

  private readonly pageIcons: Record<string, string> = {
    dashboard: 'dashboard',
    produits: 'inventory_2',
    stocks: 'warehouse',
    historique: 'history',
    profil: 'person'
  };

  get activePageIcon(): string {
    return this.pageIcons[this.activePage] ?? 'dashboard';
  }

  constructor(private readonly router: Router) {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  navigateTo(page: string): void {
    this.router.navigate([`/${page}`]);
  }

  onNavKeydown(event: KeyboardEvent, page: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateTo(page);
    }
  }
}
