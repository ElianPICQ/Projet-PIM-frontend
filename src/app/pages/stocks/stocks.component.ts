import { Component, HostBinding } from '@angular/core';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-stocks',
  imports: [SidebarComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  private isSidebarCollapsed = false;

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.isSidebarCollapsed ? 78 : 240;
  }

  onSidebarCollapsedChange(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }
}
