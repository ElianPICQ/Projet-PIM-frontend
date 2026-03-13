import { Component, HostBinding } from '@angular/core';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-produits',
  imports: [SidebarComponent],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.css'
})
export class ProduitsComponent {
  private isSidebarCollapsed = false;

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.isSidebarCollapsed ? 78 : 240;
  }

  onSidebarCollapsedChange(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }
}
