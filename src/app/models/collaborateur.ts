import { Tache } from './tache';

export interface Collaborateur {
  nom: string;
  prenom: string;
  email: string;
  projetId: number;
  taches: Tache[];
}
