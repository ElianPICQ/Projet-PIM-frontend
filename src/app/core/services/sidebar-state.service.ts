import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  private collapsed = false;

  get isCollapsed(): boolean {
    return this.collapsed;
  }

  setCollapsed(isCollapsed: boolean): void {
    this.collapsed = isCollapsed;
  }
}