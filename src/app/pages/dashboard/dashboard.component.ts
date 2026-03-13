import { Component, HostBinding } from '@angular/core';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private isSidebarCollapsed = false;

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.isSidebarCollapsed ? 78 : 240;
  }

  onSidebarCollapsedChange(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }
}
