# Bibliothèque de Livres en Ligne - Frontend Angular

## Description
Application frontend Angular pour la gestion d'une bibliothèque de livres en ligne. Cette application permet de gérer une collection de livres avec les fonctionnalités CRUD complètes, la recherche et la pagination.

## Fonctionnalités

### ✅ Gestion des Livres (CRUD)
- **Créer** : Ajouter de nouveaux livres via un formulaire avec validation
- **Lire** : Afficher la liste des livres avec pagination
- **Modifier** : Éditer les informations d'un livre existant
- **Supprimer** : Supprimer un livre de la collection

### ✅ Recherche Avancée
- Recherche par titre de livre
- Recherche par nom d'auteur
- Filtrage en temps réel des résultats
- Bouton d'effacement pour réinitialiser la recherche

### ✅ Pagination
- Affichage de 5 livres par page
- Navigation entre les pages
- Informations sur le nombre total de livres et de pages
- Boutons Précédent/Suivant et numéros de page

### ✅ Interface Utilisateur
- Design moderne et responsive
- Navigation intuitive avec barre de menu
- Formulaires avec validation en temps réel
- Messages d'erreur informatifs

## Technologies Utilisées

- **Angular** (dernière version) - Framework frontend
- **TypeScript** - Langage de programmation
- **HTML5 & CSS3** - Structure et styles
- **RxJS** - Programmation réactive
- **Angular Router** - Navigation entre les pages
- **Angular Reactive Forms** - Gestion des formulaires

## Structure du Projet

```
src/
├── app/
│   ├── book-list/          # Composant liste des livres
│   ├── book-add/           # Composant ajout de livre
│   ├── book-edit/          # Composant modification de livre
│   ├── services/           # Services Angular
│   ├── models/             # Modèles de données TypeScript
│   ├── app.routes.ts       # Configuration du routing
│   └── app.component.*     # Composant principal
├── styles.css              # Styles globaux
└── index.html              # Page principale
```

## Installation et Utilisation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Angular CLI

### Installation
```bash
npm install
```

### Développement
```bash
ng serve
```
L'application sera accessible sur `http://localhost:4200`

### Production
```bash
ng build --configuration production
```
Les fichiers de production seront générés dans le dossier `dist/`

## Fonctionnalités Détaillées

### Liste des Livres
- Affichage en grille responsive
- Informations complètes : titre, auteur, description, date
- Boutons d'action pour chaque livre
- Pagination automatique

### Ajout de Livre
- Formulaire avec validation
- Champs requis : titre, auteur, description, date
- Validation en temps réel
- Redirection automatique après ajout

### Recherche
- Recherche simultanée par titre et auteur
- Filtrage instantané des résultats
- Réinitialisation facile de la recherche

### Données Pré-chargées
L'application contient 5 livres français classiques :
1. Le Petit Prince - Antoine de Saint-Exupéry
2. Les Misérables - Victor Hugo
3. L'Étranger - Albert Camus
4. Madame Bovary - Gustave Flaubert
5. Le Rouge et le Noir - Stendhal

## Tests Effectués

✅ Tous les tests ont été réalisés avec succès :
- Navigation et interface utilisateur
- Fonctionnalités CRUD complètes
- Recherche et filtrage
- Pagination
- Validation des formulaires
- Responsive design

## Notes Techniques

- **Service de données** : Simulation d'un backend avec données en mémoire
- **Gestion d'état** : Utilisation de BehaviorSubject pour la réactivité
- **Validation** : Formulaires réactifs Angular avec validation personnalisée
- **Routing** : Configuration complète avec paramètres pour l'édition
- **Styles** : CSS moderne avec design responsive

## Compatibilité

- ✅ Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- ✅ Appareils mobiles et tablettes
- ✅ Responsive design adaptatif

---

**Développé avec Angular - Prêt pour l'intégration avec un backend Spring Boot**

