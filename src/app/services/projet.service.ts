import { Injectable, signal } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

export interface Projet {
  id: number;
  auteur: string;
  titre: string;

  description: string;
  dateDebut: string;
  dateFin: string;
  collaborateurs: Collaborateur[];
}

export interface Collaborateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  projetId: number;
  taches: Tache[];
}

export interface Tache {
  id: number;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: 'En cours' | 'Terminée' | 'À faire';
  collaborateurId: number;
  projetId: number;
}
export interface ProjetResponseDTO {
  projets: any[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface SearchParams {
  query: string;
  userId: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjetService {
  private apiUrl = 'http://localhost:8080/demo/api/projets';
  private selectedProjetSubject = new BehaviorSubject<Projet | null>(null);
  public selectedProjet$ = this.selectedProjetSubject.asObservable();

  // Données mockées pour le fallback
  private mockProjets: Projet[] = [
    //je gere ca ne t'en occupe pas
  ];
  // Signals pour l'état global
  private _projets = signal<any[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  private _totalProjets = signal(0);
  private _currentPage = signal(1);
  private _totalPages = signal(0);

  // Getters publics pour les signals
  projets = this._projets.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();
  totalProjets = this._totalProjets.asReadonly();
  currentPage = this._currentPage.asReadonly();
  totalPages = this._totalPages.asReadonly();
  constructor(private http: HttpClient) {}

  // CORRECTION: Gestion cohérente des appels HTTP avec fallback
  getAllProjets(
    page: number = 1,
    limit: number = 10
  ): Observable<{ projets: Projet[]; total: number }> {
    return this.http
      .get<{ projets: Projet[]; total: number }>(
        `${this.apiUrl}?page=${page}&limit=${limit}`
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.warn('Erreur API, utilisation des données mockées:', error);
          // Fallback vers les données mockées
          const start = (page - 1) * limit;
          const end = start + limit;
          const projets = this.mockProjets.slice(start, end);
          return of({
            projets: projets,
            total: this.mockProjets.length,
          });
        })
      );
  }
  // Obtenir tous les projets avec pagination
  getAllProjetsDTO(
    page: number = 1,
    limit: number = 10
  ): Observable<ProjetResponseDTO> {
    this._isLoading.set(true);
    this._error.set(null);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ProjetResponseDTO>(this.apiUrl, { params }).pipe(
      map((response: ProjetResponseDTO) => {
        this._projets.set(response.projets);
        this._totalProjets.set(response.total);
        this._currentPage.set(response.currentPage);
        this._totalPages.set(response.totalPages);
        this._isLoading.set(false);
        return response;
      }),
      catchError((error) => {
        this._error.set('Erreur lors du chargement des projets');
        this._isLoading.set(false);
        return of({
          projets: [],
          total: 0,
          currentPage: 1,
          totalPages: 0,
        } as ProjetResponseDTO);
      })
    );
  }

  /*getProjetById(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('Erreur API, utilisation des données mockées:', error);
        const projet = this.mockProjets.find((p) => p.id === id);
        if (!projet) {
          throw new Error('Projet non trouvé');
        }
        return of(projet);
      })
    );
  }*/
  getProjetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération du projet:', error);
        return of(null);
      })
    );
  }

  createProjet(projet: Partial<Projet>): Observable<Projet> {
    const cleanedProjet = {
      ...projet,
      collaborateurs: projet.collaborateurs?.map((col) => ({
        nom: col.nom,
        prenom: col.prenom,
        email: col.email,
        taches: Array.isArray(col.taches)
          ? col.taches.map((tache) => ({
              titre: tache.titre,
              description: tache.description,
              dateDebut: tache.dateDebut,
              dateFin: tache.dateFin,
              statut: tache.statut,
            }))
          : [],
      })),
    };

    return this.http.post<Projet>(this.apiUrl, cleanedProjet).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('Erreur API, utilisation des données mockées:', error);
        // Fallback vers les données mockées
        const newProjet: Projet = {
          ...projet,
          id: Math.max(...this.mockProjets.map((p) => p.id)) + 1,
          collaborateurs: projet.collaborateurs || [],
        } as Projet;

        this.mockProjets.push(newProjet);
        return of(newProjet);
      })
    );
  }

  // Modifier un projet
  updateProjet(id: number, projet: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, projet).pipe(
      catchError((error) => {
        console.error('Erreur lors de la modification du projet:', error);
        throw error;
      })
    );
  }

  // Supprimer un projet
  deleteProjet(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression du projet:', error);
        throw error;
      })
    );
  }
  // Méthode pour sélectionner un projet
  selectProjet(projet: Projet | null): void {
    this.selectedProjetSubject.next(projet);
  }

  getSelectedProjet(): Projet | null {
    return this.selectedProjetSubject.value;
  }
  resetState(): void {
    this._projets.set([]);
    this._isLoading.set(false);
    this._error.set(null);
    this._totalProjets.set(0);
    this._currentPage.set(1);
    this._totalPages.set(0);
  }
  // Méthodes utilitaires pour les tâches
  getTachesByProjet(projetId: number): Tache[] {
    const projet = this.mockProjets.find((p) => p.id === projetId);
    if (!projet) return [];

    return projet.collaborateurs.flatMap((c) => c.taches);
  }

  getCollaborateurColor(collaborateurId: number): string {
    const colors = [
      '#3B82F6',
      '#EF4444',
      '#10B981',
      '#F59E0B',
      '#8B5CF6',
      '#EC4899',
      '#06B6D4',
      '#84CC16',
    ];
    return colors[collaborateurId % colors.length];
  }

  getStatutColor(statut: string): string {
    const colors = {
      'À faire': '#10B981',
      'En cours': '#3B82F6',
      Terminée: '#EF4444',
    };
    return colors[statut as keyof typeof colors] || '#6B7280';
  }

  // Recherche avec pagination
  searchProjets(searchParams: SearchParams): Observable<ProjetResponseDTO> {
    this._isLoading.set(true);
    this._error.set(null);

    let params = new HttpParams()
      .set('query', searchParams.query)
      .set('userId', searchParams.userId.toString())
      .set('page', searchParams.page.toString())
      .set('limit', searchParams.limit.toString());

    return this.http
      .get<ProjetResponseDTO>(`${this.apiUrl}/search`, { params })
      .pipe(
        map((response: ProjetResponseDTO) => {
          this._projets.set(response.projets);
          this._totalProjets.set(response.total);
          this._currentPage.set(response.currentPage);
          this._totalPages.set(response.totalPages);
          this._isLoading.set(false);
          return response;
        }),
        catchError((error) => {
          this._error.set('Erreur lors de la recherche des projets');
          this._isLoading.set(false);
          return of({
            projets: [],
            total: 0,
            currentPage: 1,
            totalPages: 0,
          } as ProjetResponseDTO);
        })
      );
  }
}
