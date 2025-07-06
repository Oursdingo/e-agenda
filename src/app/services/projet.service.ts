import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  private apiUrl = 'http://localhost:3000/api'; // À changer selon votre backend
  private selectedProjetSubject = new BehaviorSubject<Projet | null>(null);
  public selectedProjet$ = this.selectedProjetSubject.asObservable();

  // Données mockées - À REMPLACER par vos appels HTTP
  private mockProjets: Projet[] = [
    {
      id: 1,
      auteur: 'Jean Dupont',
      titre: 'Site E-commerce',
      description: "Développement d'un site e-commerce moderne",
      dateDebut: '2024-01-15',
      dateFin: '2024-06-30',
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
              dateDebut: '2024-01-15',
              dateFin: '2024-02-15',
              statut: 'Terminée',
              collaborateurId: 1,
              projetId: 1,
            },
            {
              id: 2,
              titre: 'Intégration Frontend',
              description: 'Dev des composants React',
              dateDebut: '2024-02-16',
              dateFin: '2024-04-15',
              statut: 'En cours',
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
              dateDebut: '2024-03-01',
              dateFin: '2024-03-15',
              statut: 'Terminée',
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

  // Méthodes pour récupérer les projets
  getAllProjets(
    page: number = 1,
    limit: number = 10
  ): Observable<{ projets: Projet[]; total: number }> {
    // MOCK - À remplacer par : return this.http.get<{projets: Projet[], total: number}>(`${this.apiUrl}/projets?page=${page}&limit=${limit}`);

    const start = (page - 1) * limit;
    const end = start + limit;
    const projets = this.mockProjets.slice(start, end);

    return of({
      projets: projets,
      total: this.mockProjets.length,
    });
  }

  getProjetById(id: number): Observable<Projet> {
    // MOCK - À remplacer par : return this.http.get<Projet>(`${this.apiUrl}/projets/${id}`);
    const projet = this.mockProjets.find((p) => p.id === id);
    return of(projet!);
  }

  createProjet(projet: Partial<Projet>): Observable<Projet> {
    // MOCK - À remplacer par : return this.http.post<Projet>(`${this.apiUrl}/projets`, projet);
    const newProjet: Projet = {
      ...projet,
      id: Math.max(...this.mockProjets.map((p) => p.id)) + 1,
      collaborateurs: [],
    } as Projet;

    this.mockProjets.push(newProjet);
    return of(newProjet);
  }

  updateProjet(id: number, projet: Partial<Projet>): Observable<Projet> {
    // MOCK - À remplacer par : return this.http.put<Projet>(`${this.apiUrl}/projets/${id}`, projet);
    const index = this.mockProjets.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProjets[index] = { ...this.mockProjets[index], ...projet };
      return of(this.mockProjets[index]);
    }
    throw new Error('Projet non trouvé');
  }

  deleteProjet(id: number): Observable<boolean> {
    // MOCK - À remplacer par : return this.http.delete<boolean>(`${this.apiUrl}/projets/${id}`);
    const index = this.mockProjets.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProjets.splice(index, 1);
      return of(true);
    }
    return of(false);
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
      'À faire': '#6B7280',
      'En cours': '#3B82F6',
      Terminée: '#10B981',
    };
    return colors[statut as keyof typeof colors] || '#6B7280';
  }
}
