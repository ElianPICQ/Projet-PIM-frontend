import { Component, HostBinding } from '@angular/core';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { HeaderComponent } from "src/app/shared/header/header.component";

@Component({
  selector: 'app-stocks',
  imports: [SidebarComponent, HeaderComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  constructor(private readonly sidebarStateService: SidebarStateService) {}

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.sidebarStateService.isCollapsed ? 50 : 180;
  }
}
