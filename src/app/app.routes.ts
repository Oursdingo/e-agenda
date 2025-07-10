import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookListComponent } from './book-list/book-list';
import { BookAddComponent } from './book-add/book-add';
import { BookEditComponent } from './book-edit/book-edit';
import { AuthGuard } from './services/auth.guard';
import { StatistiquesComponent } from './statistiques/statistiques.component';
import { ProjetAddComponent } from './components/projet/projet-add/projet-add';
import { ProjetListComponent } from './components/projet/projet-list/projet-list';
import { ProjetEditComponent } from './components/projet/projet-edit/projet-edit';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'projects',
    component: ProjetListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/add',
    component: ProjetAddComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'projects/edit',
    component: ProjetEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'stats', component: StatistiquesComponent, canActivate: [AuthGuard] },
];
