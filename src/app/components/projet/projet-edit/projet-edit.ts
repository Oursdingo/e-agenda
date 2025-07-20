import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';

@Component({
  selector: 'app-projet-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './projet-edit.html',
  styleUrls: ['./projet-edit.css'],
})
export class ProjetEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private projetService = inject(ProjetService);

  // Signaux pour l'état du composant
  private _searchForm = signal<FormGroup>(this.createSearchForm());
  private _collaborateurForm = signal<FormGroup>(
    this.createCollaborateurForm()
  );
  private _projetForm = signal<FormGroup>(this.createProjetForm());
  projetForm = this._projetForm.asReadonly();

  private _tacheForm = signal<FormGroup>(this.createTacheForm());
  private _showCollaborateurModal = signal(false);
  private _showTacheModal = signal(false);
  private _showDetailModal = signal(false);
  private _selectedProjet = signal<any>(null);
  private _selectedCollaborateur = signal<any>(null);
  private _editMode = signal(false);
  private _isSearching = signal(false);
  private _currentUserId = signal(1);
  private _currentPage = signal(1); // Ajout du signal pour la page courante
  private _editingCollaborateur = signal<any>(null);
  private _editingTache = signal<any>(null);
  editingCollaborateur = this._editingCollaborateur.asReadonly();
  editingTache = this._editingTache.asReadonly();

  // Getters publics pour les signaux
  searchForm = this._searchForm.asReadonly();
  collaborateurForm = this._collaborateurForm.asReadonly();
  tacheForm = this._tacheForm.asReadonly();
  showCollaborateurModal = this._showCollaborateurModal.asReadonly();
  showTacheModal = this._showTacheModal.asReadonly();
  showDetailModal = this._showDetailModal.asReadonly();
  selectedProjet = this._selectedProjet.asReadonly();
  selectedCollaborateur = this._selectedCollaborateur.asReadonly();
  editMode = this._editMode.asReadonly();
  isSearching = this._isSearching.asReadonly();
  currentPage = this._currentPage.asReadonly();

  // Accès aux signaux du service
  projets = this.projetService.projets;
  isLoading = this.projetService.isLoading;
  error = this.projetService.error;
  totalProjets = this.projetService.totalProjets;
  totalPages = this.projetService.totalPages;

  // Propriétés calculées
  paginationPages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    for (
      let i = Math.max(1, current - 2);
      i <= Math.min(total, current + 2);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  });

  // Référence à la classe Array pour le template
  Array = Array;

  ngOnInit() {
    this.loadProjets();
  }

  // Création des formulaires
  private createSearchForm(): FormGroup {
    return this.fb.group({
      query: [''],
    });
  }

  private createCollaborateurForm(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private createTacheForm(): FormGroup {
    return this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      statut: ['À faire', Validators.required],
    });
  }

  // Méthodes de chargement
  // Dans projet-edit.component.ts
  loadProjets() {
    const query = this.searchForm().get('query')?.value || '';

    if (query.trim()) {
      console.log(`la valeur du query passez est :${query}`);
      console.log(`la valeur de l'id  passez est :${this._currentUserId}`);
      const searchParams = {
        query: query,
        userId: this._currentUserId(),
        page: this.currentPage(),
        limit: 10,
      };
      this.projetService.searchProjets(searchParams).subscribe();
    } else {
      // Chargement normal sans recherche
      this.projetService.getAllProjetsDTO(this.currentPage(), 10).subscribe();
    }
  }

  // Méthodes de recherche
  onSearch() {
    this._isSearching.set(true);
    this._currentPage.set(1); // Reset à la page 1 lors d'une recherche
    this.loadProjets();
    setTimeout(() => this._isSearching.set(false), 1000);
  }

  clearSearch() {
    this._searchForm.set(this.createSearchForm());
    this._currentPage.set(1);
    this.loadProjets();
  }

  // Méthodes de pagination
  goToPage(page: number) {
    this._currentPage.set(page);
    this.loadProjets();
  }

  goToPreviousPage() {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  // Méthodes des modales
  openProjetDetail(projet: any) {
    // console.log(`projet dans openProjetDetail:`, projet);
    this._selectedProjet.set(projet);
    this._editMode.set(false);
    this._showDetailModal.set(true);
  }

  openCollaborateurModal() {
    this._collaborateurForm.set(this.createCollaborateurForm());
    this._showCollaborateurModal.set(true);
  }

  openTacheModal(collaborateur: any) {
    this._selectedCollaborateur.set(collaborateur);
    this._tacheForm.set(this.createTacheForm());
    this._showTacheModal.set(true);
  }

  closeDetailModal() {
    this._showDetailModal.set(false);
    this._selectedProjet.set(null);
    this._editMode.set(false);
  }

  // Méthodes d'ajout
  addCollaborateur() {
    if (this.collaborateurForm().valid) {
      const newCollaborateur = {
        ...this.collaborateurForm().value,
        taches: [],
      };

      const projet = this.selectedProjet();
      if (projet) {
        if (!projet.collaborateurs) {
          projet.collaborateurs = [];
        }
        projet.collaborateurs.push(newCollaborateur);
      }

      this.closeCollaborateurModal();
    } else {
      this.markFormGroupTouched(this.collaborateurForm());
    }
  }

  addTache() {
    if (this.tacheForm().valid) {
      const newTache = {
        ...this.tacheForm().value,
        id: Date.now(),
      };

      const collaborateur = this.selectedCollaborateur();
      if (collaborateur) {
        if (!collaborateur.taches) {
          collaborateur.taches = [];
        }
        collaborateur.taches.push(newTache);
      }

      this.closeTacheModal();
    } else {
      this.markFormGroupTouched(this.tacheForm());
    }
  }

  // Méthodes de suppression
  deleteProjet(projetId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projetService.deleteProjet(projetId).subscribe({
        next: () => {
          this.loadProjets();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        },
      });
    }
  }

  deleteCollaborateur(collaborateurIndex: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce collaborateur ?')) {
      const projet = this.selectedProjet();
      if (projet && projet.collaborateurs) {
        projet.collaborateurs.splice(collaborateurIndex, 1);
      }
    }
  }

  deleteTache(collaborateur: any, tacheIndex: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      if (collaborateur.taches) {
        collaborateur.taches.splice(tacheIndex, 1);
      }
    }
  }

  // Méthodes utilitaires
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getStatusColor(statut: string): string {
    switch (statut) {
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'À faire':
        return 'bg-yellow-100 text-yellow-800';
      case 'En attente':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  getStatusDot(statut: string): string {
    switch (statut) {
      case 'À faire':
        return 'status-dot-todo';
      case 'En cours':
        return 'status-dot-progress';
      case 'Terminée':
        return 'status-dot-done';
      default:
        return 'status-dot-todo';
    }
  }

  getTotalTaches(collaborateurs: any[]): number {
    return (
      collaborateurs?.reduce(
        (total, collab) => total + (collab.taches?.length || 0),
        0
      ) || 0
    );
  }

  goBack(): void {
    this.router.navigate(['/projets']);
  }
  // Ajoutez un signal pour indiquer la sauvegarde en cours
  private _isSaving = signal(false);
  isSaving = this._isSaving.asReadonly();

  private createProjetForm(): FormGroup {
    return this.fb.group({
      titre: ['', Validators.required],
      auteur: ['', Validators.required],
      description: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
    });
  }
  openProjetEdit(projet: any) {
    this._selectedProjet.set(projet);
    this._editMode.set(true);
    this._showDetailModal.set(true);

    // Initialiser le formulaire avec les valeurs existantes
    this._projetForm.set(
      this.fb.group({
        titre: [projet.titre || '', Validators.required],
        auteur: [projet.auteur || '', Validators.required],
        description: [projet.description || ''],
        dateDebut: [projet.dateDebut || '', Validators.required],
        dateFin: [projet.dateFin || '', Validators.required],
      })
    );
  }
  editCollaborateur(collaborateur: any) {
    this._editingCollaborateur.set(collaborateur);
    this._collaborateurForm.set(
      this.fb.group({
        nom: [collaborateur.nom || '', Validators.required],
        prenom: [collaborateur.prenom || '', Validators.required],
        email: [
          collaborateur.email || '',
          [Validators.required, Validators.email],
        ],
      })
    );
    this._showCollaborateurModal.set(true);
  }
  editTache(tache: any, collaborateur: any) {
    this._editingTache.set(tache);
    this._selectedCollaborateur.set(collaborateur);
    this._tacheForm.set(
      this.fb.group({
        titre: [tache.titre || '', Validators.required],
        description: [tache.description || ''],
        dateDebut: [tache.dateDebut || '', Validators.required],
        dateFin: [tache.dateFin || '', Validators.required],
        statut: [tache.statut || 'À faire', Validators.required],
      })
    );
    this._showTacheModal.set(true);
  }
  saveProjet() {
    const projet = this.selectedProjet();
    console.log(`Le projet sélectionné  a modifier est :`, projet);
    if (projet && projet.id) {
      // Mettre à jour les champs du projet depuis le formulaire
      const formValues = this.projetForm().value;
      console.log(`les valeurs du formulaire sont :`, formValues);
      Object.assign(projet, formValues);
      console.log('********');
      console.log(`Le projet sélectionné  a modifier new value est :`, projet);
      this._isSaving.set(true);
      this.projetService.updateProjet(projet.id, projet).subscribe({
        next: (response) => {
          console.log('Projet sauvegardé avec succès', response);
          this.loadProjets();
          this.closeDetailModal();
          this._isSaving.set(false);
          alert('Projet modifié avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde:', error);
          this._isSaving.set(false);
          alert('Erreur lors de la sauvegarde du projet');
        },
      });
    }
  }
  saveCollaborateur() {
    if (this.collaborateurForm().valid) {
      const formValues = this.collaborateurForm().value;
      const editingCollab = this.editingCollaborateur();

      if (editingCollab) {
        // Modification d'un collaborateur existant
        Object.assign(editingCollab, formValues);
        this._editingCollaborateur.set(null);
      } else {
        // Ajout d'un nouveau collaborateur
        const newCollaborateur = { ...formValues, taches: [] };
        const projet = this.selectedProjet();
        if (projet) {
          if (!projet.collaborateurs) projet.collaborateurs = [];
          projet.collaborateurs.push(newCollaborateur);
        }
      }

      this.closeCollaborateurModal();
    } else {
      this.markFormGroupTouched(this.collaborateurForm());
    }
  }

  // 9. Sauvegarder tâche modifiée
  saveTache() {
    if (this.tacheForm().valid) {
      const formValues = this.tacheForm().value;
      const editingTask = this.editingTache();

      if (editingTask) {
        // Modification d'une tâche existante
        Object.assign(editingTask, formValues);
        this._editingTache.set(null);
      } else {
        // Ajout d'une nouvelle tâche
        const newTache = { ...formValues };
        const collaborateur = this.selectedCollaborateur();
        if (collaborateur) {
          if (!collaborateur.taches) collaborateur.taches = [];
          collaborateur.taches.push(newTache);
        }
      }

      this.closeTacheModal();
    } else {
      this.markFormGroupTouched(this.tacheForm());
    }
  }

  // 10. Réinitialiser les modales
  closeCollaborateurModal() {
    this._showCollaborateurModal.set(false);
    this._selectedCollaborateur.set(null);
    this._editingCollaborateur.set(null);
  }

  closeTacheModal() {
    this._showTacheModal.set(false);
    this._selectedCollaborateur.set(null);
    this._editingTache.set(null);
  }
}
