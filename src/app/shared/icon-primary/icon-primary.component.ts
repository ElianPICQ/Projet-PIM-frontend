import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-primary',
  imports: [MatIconModule],
  templateUrl: './icon-primary.component.html',
  styleUrl: './icon-primary.component.css'
})
export class IconPrimaryComponent {
  @Input() icon = '';
  @Input() state = 'default';
  @Input() size = 36;
  @Input() iconSize = 24;
}
