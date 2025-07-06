import { Tache } from './tache';

export interface Collaborateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  projetId: number;
  taches: Tache[];
}
