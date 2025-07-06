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

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  taches: Tache[];
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
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayTaches = this.getTachesForDate(date);

      this.calendarDays.push({
        date: date,
        isCurrentMonth: date.getMonth() === this.currentMonth,
        isToday: this.isToday(date),
        taches: dayTaches,
      });
    }
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
