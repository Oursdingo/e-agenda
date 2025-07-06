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
import { ProjectService } from '../../../services/projet';
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
  styleUrl: './projet-add.css',
})
export class ProjetAdd implements OnInit {
  projetForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private projetService: ProjectService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    const forbiddenChars = /[{}.*\/\-+)(:;,]/;
    const forbiddenValidator: ValidatorFn = (
      control: AbstractControl
    ): ValidationErrors | null => {
      return forbiddenChars.test(control.value)
        ? { forbiddenChars: true }
        : null;
    };
    this.projetForm = this.fb.group({
      titre: ['', [Validators.required, forbiddenValidator]],
      auteur: ['', [Validators.required, forbiddenValidator]],
      description: ['', [Validators.required, forbiddenValidator]],
      dateDebut: ['', [Validators.required, this.futureDateValidator()]],
      dateFin: ['', [Validators.required, this.futureDateValidator()]],
      collaborateurs: this.fb.array([]),
    });
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
    // Vérification doublon côté front (titre + datePublication)
    this.projetService.getProjects().subscribe((response) => {
      const projects = response.content || [];
      const exists = projects.some(
        (projet: Projet) =>
          projet.titre.trim().toLowerCase() ===
            this.projetForm.value.titre.trim().toLowerCase() &&
          projet.dateDebut === this.projetForm.value.datePublication &&
          projet.dateFin === this.projetForm.value.datePublication
      );
      if (exists) {
        this.toastr.error(
          'Un projet avec ce titre et ses dates existe déjà.',
          'Erreur'
        );
        return;
      }
      this.projetService.addProject(this.projetForm.value).subscribe({
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
}
