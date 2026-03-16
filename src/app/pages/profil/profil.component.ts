import { Component, HostBinding } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarStateService } from 'src/app/core/services/sidebar-state.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { IconPrimaryComponent } from 'src/app/shared/icon-primary/icon-primary.component';
import { InputFieldComponent } from 'src/app/shared/input-field/input-field.component';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-profil',
  imports: [HeaderComponent, SidebarComponent,IconPrimaryComponent, InputFieldComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  readonly username = localStorage.getItem('username') ?? '';

  private $oldPassword !: string;
  private $newPassword !: string;
  private $confirmPassword !: string;

  constructor(private authService: AuthService, private readonly sidebarStateService: SidebarStateService) {}

  @HostBinding('style.margin-left.px')
  get hostMarginLeft(): number {
    return this.sidebarStateService.isCollapsed ? 50 : 180;
  }

  changePassword(oldPassword: string, newPassword: string, confirmPassword: string): void {
    this.$oldPassword = oldPassword;
    this.$newPassword = newPassword;
    this.$confirmPassword = confirmPassword;

    if (this.$newPassword !== this.$confirmPassword) {
      alert('Le nouveau mot de passe et la confirmation ne correspondent pas.');
      return;
    }

    if (!this.$oldPassword ||!this.$newPassword || !this.$confirmPassword) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    this.authService.changepassword(this.$oldPassword, this.$newPassword, this.$confirmPassword).subscribe({
      next: (response) => {
        console.log('Change password success', response);
      },
      error: (error) => {
        console.error('Change password error', error);
      }
    });
  }
}
