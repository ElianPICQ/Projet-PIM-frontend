import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { IconPrimaryComponent } from 'src/app/shared/icon-primary/icon-primary.component';
import { InputFieldComponent } from 'src/app/shared/input-field/input-field.component';

@Component({
  selector: 'app-login',
  imports: [InputFieldComponent, IconPrimaryComponent, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent
{
  $username !: string;
  $password !: string;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this
  }

  ngOnInit()
  {
    // Si "Se souvenir de moi" activé, remplir automatiquement les variables $username & $password ainsi que les inputs.
  }

  login(formUsername: string, formPassword: string)
  {
    this.$username = formUsername;
    this.$password = formPassword;

    this.authService.login(this.$username, this.$password).subscribe({
      next: (response) => {
        console.log('Login success', response);
        if (response.success && 'access' in response && 'refresh' in response) {
          this.authService.setTokens(response.access, response.refresh);
          localStorage.setItem('username', response.user.username);
          this.router.navigate(['/dashboard'])
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        this.snackBar.open('Identifiants erronés', '', {
          duration: 5000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

/*   register(formUsername: string, formPassword: string)
  {
    this.$username = formUsername;
    this.$password = formPassword;
    
    console.log(this.$username, this.$password);
  } */
}
