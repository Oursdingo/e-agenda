export interface Tache {
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: 'En cours' | 'Terminée' | 'À faire';
  collaborateurId: number; // ID du collaborateur assigné à la tâche
  projetId: number; // ID du projet auquel la tâche est associée
}
