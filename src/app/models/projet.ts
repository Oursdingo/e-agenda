import { Collaborateur } from './collaborateur';

export interface Projet {
  id: number;
  auteur: string;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  collaborateurs: Collaborateur[];
}
