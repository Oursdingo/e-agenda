import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ProjetService,
  Projet,
  Collaborateur,
  Tache,
} from '../../../services/projet.service';
import { Subscription } from 'rxjs';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  taches: Tache[];
  tachePeriods: TachePeriod[]; // Nouvelle propriété
}

export interface TachePeriod {
  tache: Tache;
  collaborateur: Collaborateur;
  color: string;
  isStart: boolean;
  isEnd: boolean;
  isMiddle: boolean;
  displayText: string;
}

@Component({
  selector: 'app-projet-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projet-list.html',
  styleUrls: ['./projet-list.css'],
})
export class ProjetListComponent implements OnInit, OnDestroy {
  projets: Projet[] = [];
  selectedProjet: Projet | null = null;
  expandedProjetId: number | null = null;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalProjets: number = 0;
  totalPages: number = 0;

  // Calendrier
  currentDate: Date = new Date();
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  calendarDays: CalendarDay[] = [];
  monthNames: string[] = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  // Responsive
  isMobileMenuOpen: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(private projetService: ProjetService) {}

  ngOnInit(): void {
    this.loadProjets();
    this.generateCalendar();

    // S'abonner aux changements de projet sélectionné
    this.subscriptions.add(
      this.projetService.selectedProjet$.subscribe((projet) => {
        this.selectedProjet = projet;
        this.generateCalendar();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProjets(): void {
    this.projetService
      .getAllProjets(this.currentPage, this.itemsPerPage)
      .subscribe((response) => {
        this.projets = response.projets;
        this.totalProjets = response.total;
        this.totalPages = Math.ceil(this.totalProjets / this.itemsPerPage);
      });
  }

  toggleProjet(projetId: number): void {
    if (this.expandedProjetId === projetId) {
      this.expandedProjetId = null;
      this.projetService.selectProjet(null);
    } else {
      this.expandedProjetId = projetId;
      const projet = this.projets.find((p) => p.id === projetId);
      if (projet) {
        this.projetService.selectProjet(projet);
      }
    }
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProjets();
    }
  }

  // Calendrier
  generateCalendar(): void {
    this.calendarDays = [];
    const year = this.currentYear;
    const month = this.currentMonth;

    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Premier jour à afficher (peut être du mois précédent)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // Dernier jour à afficher (peut être du mois suivant)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    // Générer tous les jours
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const day: CalendarDay = {
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isToday(currentDate),
        taches: [],
        tachePeriods: [],
      };

      // Ajouter les tâches du jour
      if (this.selectedProjet) {
        day.taches = this.getTachesForDate(currentDate);
        day.tachePeriods = this.getTachePeriodsForDate(currentDate);
      }

      this.calendarDays.push(day);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  getTachePeriodsForDate(date: Date): TachePeriod[] {
    if (!this.selectedProjet) return [];

    const periods: TachePeriod[] = [];

    this.selectedProjet.collaborateurs.forEach((collaborateur) => {
      collaborateur.taches.forEach((tache) => {
        if (tache.statut === 'En cours') {
          // Seulement les tâches en cours
          const startDate = new Date(tache.dateDebut);
          const endDate = new Date(tache.dateFin);

          // Vérifier si la date est dans la période de la tâche
          if (date >= startDate && date <= endDate) {
            const period: TachePeriod = {
              tache: tache,
              collaborateur: collaborateur,
              color: this.getCollaborateurColor(collaborateur.id),
              isStart: this.isSameDay(date, startDate),
              isEnd: this.isSameDay(date, endDate),
              isMiddle:
                !this.isSameDay(date, startDate) &&
                !this.isSameDay(date, endDate),
              displayText: this.getDisplayText(
                tache,
                collaborateur,
                date,
                startDate,
                endDate
              ),
            };
            periods.push(period);
          }
        }
      });
    });

    return periods;
  }
  // Méthode pour générer le texte à afficher
  getDisplayText(
    tache: Tache,
    collaborateur: Collaborateur,
    currentDate: Date,
    startDate: Date,
    endDate: Date
  ): string {
    if (this.isSameDay(currentDate, startDate)) {
      return `${collaborateur.prenom} - ${tache.titre}`;
    } else if (this.isSameDay(currentDate, endDate)) {
      return `Fin: ${tache.titre}`;
    } else {
      return `${collaborateur.prenom} - ${tache.titre}`;
    }
  }

  // Méthode utilitaire pour comparer les dates
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  // Méthode pour obtenir le style de la période
  getPeriodStyle(period: TachePeriod): any {
    let borderRadius = '0px';

    if (period.isStart && period.isEnd) {
      // Tâche d'un seul jour
      borderRadius = '6px';
    } else if (period.isStart) {
      // Premier jour
      borderRadius = '6px 0 0 6px';
    } else if (period.isEnd) {
      // Dernier jour
      borderRadius = '0 6px 6px 0';
    }

    return {
      'background-color': period.color,
      'border-radius': borderRadius,
      opacity: '0.8',
    };
  }

  // Méthode pour obtenir les classes CSS de la période
  getPeriodClasses(period: TachePeriod): string {
    let classes = 'task-period';

    if (period.isStart) classes += ' period-start';
    if (period.isEnd) classes += ' period-end';
    if (period.isMiddle) classes += ' period-middle';

    return classes;
  }
  getTachesForDate(date: Date): Tache[] {
    if (!this.selectedProjet) return [];

    const dateStr = date.toISOString().split('T')[0];
    const allTaches = this.selectedProjet.collaborateurs.flatMap(
      (c) => c.taches
    );

    return allTaches.filter((tache) => {
      const debut = new Date(tache.dateDebut);
      const fin = new Date(tache.dateFin);
      return date >= debut && date <= fin;
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  // Méthodes utilitaires
  getCollaborateurColor(collaborateurId: number): string {
    return this.projetService.getCollaborateurColor(collaborateurId);
  }

  getStatutColor(statut: string): string {
    return this.projetService.getStatutColor(statut);
  }

  getCollaborateurName(collaborateurId: number): string {
    if (!this.selectedProjet) return '';
    const collaborateur = this.selectedProjet.collaborateurs.find(
      (c) => c.id === collaborateurId
    );
    return collaborateur ? `${collaborateur.prenom} ${collaborateur.nom}` : '';
  }

  // Responsive
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
  //by me

  get totalCollaborateurs(): number {
    return (
      this.projets?.reduce(
        (acc: number, p: any) => acc + (p.collaborateurs?.length || 0),
        0
      ) || 0
    );
  }
}
