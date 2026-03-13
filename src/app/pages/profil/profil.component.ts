import { Component, HostBinding } from '@angular/core';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-profil',
  imports: [SidebarComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  private isSidebarCollapsed = false;

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.isSidebarCollapsed ? 78 : 240;
  }

  onSidebarCollapsedChange(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }
}
