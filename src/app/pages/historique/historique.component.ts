import { Component, HostBinding } from '@angular/core';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-historique',
  imports: [SidebarComponent],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent {
  private isSidebarCollapsed = false;

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.isSidebarCollapsed ? 78 : 240;
  }

  onSidebarCollapsedChange(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }
}
