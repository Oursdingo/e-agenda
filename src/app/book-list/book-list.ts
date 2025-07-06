import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookService } from '../services/book';
import { Book } from '../models/book.model';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  totalPages = 0;
  totalElements = 0;
  currentPage = 0;
  pages: number[] = [];

  searchCriteria = {
    query: ''
  };

  constructor(private bookService: BookService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadBooks(0);
  }

  loadBooks(page: number): void {
    this.currentPage = page;
    this.bookService
      .searchBooks(this.searchCriteria.query, page, 6)
      .subscribe((response: any) => {
        this.books = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.pages = Array(this.totalPages).fill(0).map((_, i) => i);
      });
  }

  onSearch(): void {
    this.loadBooks(0);
  }

  clearSearch(): void {
    this.searchCriteria = { query: '' };
    this.loadBooks(0);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadBooks(page);
    }
  }

  deleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe(() => {
      this.toastr.error('Livre supprimé avec succès !', 'Suppression');
      this.loadBooks(this.currentPage);
    });
  }

  confirmDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      this.deleteBook(id);
    }
  }
}


