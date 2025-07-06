import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookListComponent } from './book-list/book-list';
import { BookAddComponent } from './book-add/book-add';
import { BookEditComponent } from './book-edit/book-edit';
import { AuthGuard } from './services/auth.guard';
import { StatistiquesComponent } from './statistiques/statistiques.component';
import { ProjetAddComponent } from './components/projet/projet-add/projet-add';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'books', component: BookListComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: BookListComponent, canActivate: [AuthGuard] },
  {
    path: 'books/add',
    component: BookAddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/add',
    component: ProjetAddComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'books/edit/:id',
    component: BookEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'stats', component: StatistiquesComponent, canActivate: [AuthGuard] },
];
