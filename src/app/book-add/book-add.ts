import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '../services/book';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Book } from '../models/book.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './book-add.html',
  styleUrls: ['./book-add.css']
})
export class BookAddComponent implements OnInit {
  bookForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const forbiddenChars = /[{}.*\/\-+)(:;,]/;
    const forbiddenValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      return forbiddenChars.test(control.value) ? { forbiddenChars: true } : null;
    };
    this.bookForm = this.fb.group({
      titre: ['', [Validators.required, forbiddenValidator]],
      auteur: ['', [Validators.required, forbiddenValidator]],
      description: ['', [Validators.required, forbiddenValidator]],
      datePublication: ['', [Validators.required, this.futureDateValidator()]]
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) return;
    // Vérification doublon côté front (titre + datePublication)
    this.bookService.getBooks().subscribe((response) => {
      const books = response.content || [];
      const exists = books.some((book: Book) =>
        book.titre.trim().toLowerCase() === this.bookForm.value.titre.trim().toLowerCase() &&
        book.datePublication === this.bookForm.value.datePublication
      );
      if (exists) {
        this.toastr.error('Un livre avec ce titre et cette date de publication existe déjà.', 'Erreur');
        return;
      }
      this.bookService.addBook(this.bookForm.value).subscribe({
        next: () => {
          this.toastr.success('Livre ajouté avec succès !', 'Succès');
          this.router.navigate(['/books']);
        },
        error: (error) => {
          if (error.error && typeof error.error === 'string' && error.error.includes('appartient déjà à un auteur')) {
            this.toastr.error(error.error, 'Erreur');
          } else if (error.error && typeof error.error === 'string' && error.error.includes('existe déjà')) {
            this.toastr.error(error.error, 'Erreur');
          } else {
            this.toastr.error('Erreur lors de l\'ajout du livre. Veuillez réessayer.', 'Erreur');
          }
        }
      });
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.bookForm.get(controlName);
    if (control?.hasError('required')) return 'Ce champ est requis.';
    if (control?.hasError('forbiddenChars')) return 'Caractères spéciaux interdits: {} . * / - + ) ( : ; ,';
    return '';
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const today = new Date();
      const inputDate = new Date(value);
      today.setHours(0,0,0,0);
      inputDate.setHours(0,0,0,0);
      return inputDate > today ? { futureDate: true } : null;
    };
  }
}

