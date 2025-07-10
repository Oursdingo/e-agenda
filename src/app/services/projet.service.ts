import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root',
})
export class ProjetService {
  private apiUrl = 'http://localhost:8080/demo/api/projets';
  private selectedProjetSubject = new BehaviorSubject<Projet | null>(null);
  public selectedProjet$ = this.selectedProjetSubject.asObservable();

  // Données mockées pour le fallback
  private mockProjets: Projet[] = [
    {
      id: 1,
      auteur: 'Jean Dupont',
      titre: 'Site E-commerce',
      description: "Développement d'un site e-commerce moderne",
      dateDebut: '2025-07-05',
      dateFin: '2025-08-30',
      collaborateurs: [
        {
          id: 1,
          nom: 'Martin',
          prenom: 'Sophie',
          email: 'sophie.martin@email.com',
          projetId: 1,
          taches: [
            {
              id: 1,
              titre: 'Design UI/UX',
              description: 'Création des maquettes',
              dateDebut: '2025-07-10',
              dateFin: '2025-08-15',
              statut: 'En cours',
              collaborateurId: 1,
              projetId: 1,
            },
            {
              id: 2,
              titre: 'Intégration Frontend',
              description: 'Dev des composants React',
              dateDebut: '2025-07-16',
              dateFin: '2025-08-10',
              statut: 'À faire',
              collaborateurId: 1,
              projetId: 1,
            },
          ],
        },
        {
          id: 2,
          nom: 'Dubois',
          prenom: 'Pierre',
          email: 'pierre.dubois@email.com',
          projetId: 1,
          taches: [
            {
              id: 3,
              titre: 'API Backend',
              description: 'Développement des endpoints',
              dateDebut: '2024-02-01',
              dateFin: '2024-05-01',
              statut: 'En cours',
              collaborateurId: 2,
              projetId: 1,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      auteur: 'Marie Leblanc',
      titre: 'App Mobile Banking',
      description: 'Application mobile pour services bancaires',
      dateDebut: '2024-03-01',
      dateFin: '2024-08-31',
      collaborateurs: [
        {
          id: 3,
          nom: 'Garcia',
          prenom: 'Carlos',
          email: 'carlos.garcia@email.com',
          projetId: 2,
          taches: [
            {
              id: 4,
              titre: 'Architecture Mobile',
              description: 'Setup du projet Flutter',
              dateDebut: '2025-07-01',
              dateFin: '2025-07-25',
              statut: 'En cours',
              collaborateurId: 3,
              projetId: 2,
            },
            {
              id: 5,
              titre: 'Authentification',
              description: 'Module de connexion sécurisée',
              dateDebut: '2024-03-16',
              dateFin: '2024-04-30',
              statut: 'À faire',
              collaborateurId: 3,
              projetId: 2,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      auteur: 'Paul Moreau',
      titre: 'Dashboard Analytics',
      description: "Tableau de bord pour l'analyse de données",
      dateDebut: '2024-02-01',
      dateFin: '2024-07-15',
      collaborateurs: [
        {
          id: 4,
          nom: 'Chen',
          prenom: 'Li',
          email: 'li.chen@email.com',
          projetId: 3,
          taches: [
            {
              id: 6,
              titre: 'Visualisation données',
              description: 'Graphiques et charts',
              dateDebut: '2024-02-01',
              dateFin: '2024-05-01',
              statut: 'En cours',
              collaborateurId: 4,
              projetId: 3,
            },
          ],
        },
      ],
    },
  ];

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

  getProjetById(id: number): Observable<Projet> {
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

  updateProjet(id: number, projet: Partial<Projet>): Observable<Projet> {
    return this.http.put<Projet>(`${this.apiUrl}/${id}`, projet).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('Erreur API, utilisation des données mockées:', error);
        const index = this.mockProjets.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.mockProjets[index] = { ...this.mockProjets[index], ...projet };
          return of(this.mockProjets[index]);
        }
        throw new Error('Projet non trouvé');
      })
    );
  }

  deleteProjet(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('Erreur API, utilisation des données mockées:', error);
        const index = this.mockProjets.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.mockProjets.splice(index, 1);
          return of(true);
        }
        return of(false);
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
}
