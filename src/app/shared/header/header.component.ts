import { Component, HostBinding } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private readonly sidebarStateService: SidebarStateService) {}

  get isCollapsed(): boolean {
    return this.sidebarStateService.isCollapsed;
  }

  @HostBinding('style.left.px')
  get hostLeft(): number {
    return this.isCollapsed ? 50 : 180;
  }

  toggleSidebar(): void {
    this.sidebarStateService.setCollapsed(!this.isCollapsed);
  }

}
