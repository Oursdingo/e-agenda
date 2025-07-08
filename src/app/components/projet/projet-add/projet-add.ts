import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { ToastrService } from 'ngx-toastr';
import { Projet } from '../../../models/projet';

@Component({
  selector: 'app-projet-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './projet-add.html',
  styleUrls: ['./projet-add.css'],
})
export class ProjetAddComponent implements OnInit {
  projetForm!: FormGroup;
  collaborateurForm!: FormGroup;
  showCollaborateurModal = false;

  constructor(
    private fb: FormBuilder,
    private projetService: ProjetService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  controlNames = ['titre', 'auteur', 'description', 'dateDebut', 'dateFin'];

  ngOnInit(): void {
    const forbiddenChars = /[{}*\/+)(]/;
    const forbiddenValidator: ValidatorFn = (
      control: AbstractControl
    ): ValidationErrors | null => {
      return forbiddenChars.test(control.value)
        ? { forbiddenChars: true }
        : null;
    };

    // CORRECTION: Créer le FormGroup AVANT de s'abonner à statusChanges
    this.projetForm = this.fb.group({
      titre: ['', [Validators.required, forbiddenValidator]],
      auteur: ['', [Validators.required, forbiddenValidator]],
      description: ['', [Validators.required, forbiddenValidator]],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      collaborateurs: this.fb.array([]),
    });

    // S'abonner aux changements APRÈS avoir créé le FormGroup
    this.projetForm.statusChanges.subscribe((s) =>
      console.log('FORM STATUS', s, this.projetForm.errors)
    );

    this.initCollaborateurForm();
  }

  // Méthode pour générer les initiales
  getInitials(nom: string, prenom: string): string {
    if (!nom || !prenom) return '??';
    return (nom.charAt(0) + prenom.charAt(0)).toUpperCase();
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const today = new Date();
      const inputDate = new Date(value);
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);
      return inputDate > today ? { futureDate: true } : null;
    };
  }

  onSubmit(): void {
    if (this.projetForm.invalid) return;
    this.projetService.getAllProjets().subscribe((response) => {
      const projects = response.projets || [];
      const exists = projects.some(
        (projet: Projet) =>
          projet.titre.trim().toLowerCase() ===
            this.projetForm.value.titre.trim().toLowerCase() &&
          // CORRECTION: Utiliser les bonnes propriétés du formulaire
          projet.dateDebut === this.projetForm.value.dateDebut &&
          projet.dateFin === this.projetForm.value.dateFin
      );
      if (exists) {
        this.toastr.error(
          'Un projet avec ce titre et ses dates existe déjà.',
          'Erreur:'
        );
        return;
      }
      this.projetService.createProjet(this.projetForm.value).subscribe({
        next: () => {
          this.toastr.success('Projet ajouté avec succès !', 'Succès');
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          if (
            error.error &&
            typeof error.error === 'string' &&
            error.error.includes('appartient déjà à un auteur')
          ) {
            this.toastr.error(error.error, 'Erreur');
          } else if (
            error.error &&
            typeof error.error === 'string' &&
            error.error.includes('existe déjà')
          ) {
            this.toastr.error(error.error, 'Erreur');
          } else {
            this.toastr.error(
              "Erreur lors de l'ajout du projet. Veuillez réessayer.",
              'Erreur'
            );
          }
        },
      });
    });
  }

  get collaborateurs(): FormArray {
    return this.projetForm.get('collaborateurs') as FormArray;
  }

  openCollaborateurModal() {
    this.showCollaborateurModal = true;
  }

  closeCollaborateurModal() {
    this.showCollaborateurModal = false;
    this.collaborateurForm.reset();
    this.taches.clear();
  }

  initCollaborateurForm() {
    this.collaborateurForm = this.fb.group({
      id: [Date.now()],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      projetId: [0],
      taches: this.fb.array([]),
    });
  }

  get taches(): FormArray {
    return this.collaborateurForm.get('taches') as FormArray;
  }

  addTache() {
    this.taches.push(
      this.fb.group({
        id: [Date.now()],
        titre: ['', Validators.required],
        description: [''],
        dateDebut: ['', Validators.required],
        dateFin: ['', Validators.required],
        statut: ['À faire'],
        collaborateurId: [0],
        projetId: [0],
      })
    );
  }

  removeTache(index: number) {
    this.taches.removeAt(index);
  }

  saveCollaborateur() {
    if (this.collaborateurForm.valid) {
      // CORRECTION: Utiliser this.fb.group au lieu de this.fb.control
      this.collaborateurs.push(this.fb.group(this.collaborateurForm.value));
      this.closeCollaborateurModal();
    }
  }

  removeCollaborateur(index: number) {
    this.collaborateurs.removeAt(index);
  }

  onCancel(): void {
    // Réinitialiser le formulaire principal
    this.projetForm.reset();

    // Réinitialiser le FormArray des collaborateurs
    this.collaborateurs.clear();

    // Fermer le modal s'il est ouvert
    if (this.showCollaborateurModal) {
      this.closeCollaborateurModal();
    }

    // Réinitialiser les valeurs par défaut si nécessaire
    this.projetForm.patchValue({
      titre: '',
      auteur: '',
      description: '',
      dateDebut: '',
      dateFin: '',
    });

    // Marquer tous les champs comme non touchés pour supprimer les erreurs
    this.projetForm.markAsUntouched();
    this.projetForm.markAsPristine();

    // Optionnel : afficher un message de confirmation
    this.toastr.info('Formulaire réinitialisé', 'Information');
  }

  onCancelWithConfirmation(): void {
    // Vérifier si le formulaire a été modifié
    if (this.projetForm.dirty || this.collaborateurs.length > 0) {
      if (
        confirm(
          'Êtes-vous sûr de vouloir annuler ? Toutes les données seront perdues.'
        )
      ) {
        this.onCancel();
      }
    } else {
      this.onCancel();
    }
  }

  onCancelAndNavigate(): void {
    this.onCancel();
    this.router.navigate(['/projects']);
  }
}
