import { Component, HostBinding } from '@angular/core';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private readonly sidebarStateService: SidebarStateService) {}

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.sidebarStateService.isCollapsed ? 50 : 180;
  }
}
