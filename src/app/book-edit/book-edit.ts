import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../services/book';
import { Book } from '../models/book.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './book-edit.html',
  styleUrls: ['./book-edit.css']
})
export class BookEditComponent implements OnInit {
  bookForm!: FormGroup;
  loading = true;
  bookNotFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBook(id).subscribe({
      next: (data: Book) => {
        this.loading = false;
        this.bookForm = this.fb.group({
          id: [data.id],
          titre: [data.titre, Validators.required],
          auteur: [data.auteur, Validators.required],
          description: [data.description, Validators.required],
          datePublication: [data.datePublication, [Validators.required, this.futureDateValidator()]]
        });
      },
      error: () => {
        this.loading = false;
        this.bookNotFound = true;
      }
    });
  }

  get book(): Book | null {
    return this.bookForm ? this.bookForm.value : null;
  }

  onSubmit(): void {
    if (this.bookForm.invalid || !this.book?.id) return;

    const updatedBook = {
      id: this.book.id,
      ...this.bookForm.value
    };

    this.bookService.updateBook(this.book.id, updatedBook).subscribe(() => {
      this.toastr.info('Livre modifié avec succès !', 'Modification');
      this.router.navigate(['/books']);
    });
  }

  getErrorMessage(field: string): string {
    const control = this.bookForm.get(field);
    if (control?.hasError('required')) return 'Ce champ est requis';
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



