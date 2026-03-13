import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() activePage = '';

  constructor(private readonly router: Router) {}

  navigateTo(page: string): void {
    this.router.navigate([`/${page}`]);
  }
}
