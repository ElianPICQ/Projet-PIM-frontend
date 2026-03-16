import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-field',
  exportAs: 'appInputField',
  imports: [],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css'
})
export class InputFieldComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) inputId = '';
  @Input() name = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() value = '';

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
  }

}
