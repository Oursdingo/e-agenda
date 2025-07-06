import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Connexion</h2>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              #emailInput="ngModel"
            />
            <div *ngIf="emailInput.invalid && emailInput.touched" class="error">
              Email invalide
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              #passwordInput="ngModel"
            />
            <div *ngIf="passwordInput.invalid && passwordInput.touched" class="error">
              Le mot de passe doit contenir au moins 6 caractères
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid">Se connecter</button>
          
          <div class="register-link">
            Pas encore de compte ? <a routerLink="/register">S'inscrire</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
    }

    .login-box {
      background-color: #fff;
      padding: 2rem;
      border-radius: 0.25rem;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      width: 100%;
      max-width: 400px;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
    }

    .form-group input {
      width: 100%;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      background-image: none;
      background-clip: padding-box;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .form-group input:focus {
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .error {
      color: #dc3545;
      font-size: 0.875em;
      margin-top: 0.25rem;
    }

    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 400;
      color: #fff;
      background-color: #007bff;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;
    }

    button[type="submit"]:hover {
      background-color: #0056b3;
    }

    .register-link {
      text-align: center;
      margin-top: 2.5rem;
      z-index: 2;
      position: relative;
    }

    .register-link a {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      position: relative;
      z-index: 3;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.toastr.success('Connexion réussie !', 'Succès');
        this.router.navigate(['/books']);
      },
      (error) => {
        if (error.status === 401 || error.status === 403) {
          this.toastr.error('Identifiants incorrects. Veuillez réessayer.', 'Erreur');
        } else {
          this.toastr.error('Erreur lors de la connexion. Veuillez réessayer.', 'Erreur');
        }
        console.error('Login error', error);
      }
    );
  }
}