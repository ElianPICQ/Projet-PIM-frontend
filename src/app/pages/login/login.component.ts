import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent
{
  $username !: string;
  $password !: string;

  constructor(private authService: AuthService, private router: Router) {}

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
          this.router.navigate(['/dashboard'])
        }
      },
      error: (err) => console.error('Login failed', err)
    });
  }

/*   register(formUsername: string, formPassword: string)
  {
    this.$username = formUsername;
    this.$password = formPassword;
    
    console.log(this.$username, this.$password);
  } */
}
