import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projet } from '../models/projet';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/demo/api/projets'; // adapté au nouveau port du backend

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getProject(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.apiUrl}/${id}`);
  }

  addProject(projet: Projet): Observable<Projet> {
    return this.http.post<Projet>(this.apiUrl, projet);
  }

  updateProjet(id: number, book: Projet): Observable<Projet> {
    return this.http.put<Projet>(`${this.apiUrl}/${id}`, book);
  }

  deleteProjet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * ✅ Recherche paginée avec titre, auteur, page ET taille
   */
  searchProjet(query: string, page: number, size: number = 5): Observable<any> {
    const url = `${this.apiUrl}/search?query=${encodeURIComponent(
      query
    )}&page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }
}
