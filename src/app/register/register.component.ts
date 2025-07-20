import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-box">
        <h2
          class="flex justify-center items-center font-bold  underline text-blue-600"
        >
          Inscription
        </h2>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="lastname">Nom</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              [(ngModel)]="lastname"
              required
              minlength="2"
              #lastnameInput="ngModel"
            />
            <div
              *ngIf="lastnameInput.invalid && lastnameInput.touched"
              class="error"
            >
              Le nom est requis (2 caractères minimum)
            </div>
          </div>
          <div class="form-group">
            <label for="firstname">Prénom</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              [(ngModel)]="firstname"
              required
              minlength="2"
              #firstnameInput="ngModel"
            />
            <div
              *ngIf="firstnameInput.invalid && firstnameInput.touched"
              class="error"
            >
              Le prénom est requis (2 caractères minimum)
            </div>
          </div>
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
            <div
              *ngIf="passwordInput.invalid && passwordInput.touched"
              class="error"
            >
              Le mot de passe doit contenir au moins 6 caractères
            </div>
          </div>
          <div class="form-group">
            <label for="password">Confirmer Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              #passwordInput="ngModel"
            />
            <div
              *ngIf="passwordInput.invalid && passwordInput.touched"
              class="error"
            >
              Le mot de passe doit contenir au moins 6 caractères
            </div>
          </div>
          <button type="submit" [disabled]="registerForm.invalid">
            S'inscrire
          </button>
          <div class="login-link">
            Déjà un compte ? <a routerLink="/projects">Se connecter</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f5f5f5;
      }
      .register-box {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
      }

      .form-group {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #666;
      }
      input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
      button {
        width: 100%;
        padding: 0.75rem;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1rem;
      }
      button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
      .error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      .login-link {
        text-align: center;
        margin-top: 2.5rem;
        z-index: 2;
        position: relative;
      }
      .login-link a {
        color: #007bff;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
        position: relative;
        z-index: 3;
      }
      .login-link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class RegisterComponent {
  lastname: string = '';
  firstname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(): void {
    if (this.lastname && this.firstname && this.email && this.password) {
      this.authService
        .register(this.lastname, this.firstname, this.email, this.password)
        .subscribe({
          next: () => {
            this.toastr.success('Inscription réussie !', 'Succès');
            this.router.navigate(['/projects']);
          },
          error: (error) => {
            if (
              error.status === 400 &&
              error.error &&
              typeof error.error === 'string' &&
              error.error.includes('déjà utilisé')
            ) {
              this.toastr.error(
                'Cet email est déjà utilisé. Veuillez en choisir un autre.',
                'Erreur'
              );
            } else {
              this.toastr.error(
                "Erreur lors de l'inscription. Veuillez réessayer.",
                'Erreur'
              );
            }
            console.error("Erreur d'inscription:", error);
          },
        });
    }
  }
}
