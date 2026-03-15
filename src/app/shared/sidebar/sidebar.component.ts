import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { IconPrimaryComponent } from '../icon-primary/icon-primary.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatSidenavContainer, MatSidenav, MatSidenavContent, MatIconModule, IconPrimaryComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() activePage = '';
  @Output() collapsedChange = new EventEmitter<boolean>();

  get isCollapsed(): boolean {
    return this.sidebarStateService.isCollapsed;
  }

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

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly sidebarStateService: SidebarStateService
  ) {}

  toggleSidebar(): void {
    const nextCollapsedState = !this.isCollapsed;
    this.sidebarStateService.setCollapsed(nextCollapsedState);
    this.collapsedChange.emit(nextCollapsedState);
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

  logout() {
    this.authService.clearTokens();
    this.router.navigate(['/']);
  }
}
