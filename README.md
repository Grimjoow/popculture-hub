# PopCulture Hub 🎬

Application web (SPA) construite avec **React + Vite** permettant d’explorer des films via l’API **TMDB**.

> Mode “invité” : la Watchlist est sauvegardée en local (LocalStorage), sans compte utilisateur.

---

## ✨ Fonctionnalités

- 🔥 **Tendances de la semaine** (Trending)
- 🔎 **Recherche** de films (avec debounce)
- ➕ **Charger plus** (pagination progressive)
- 🎞️ **Page détail** : infos + genres + synopsis + **casting**
- ⭐ **Watchlist** persistée en local :
  - ajouter / retirer depuis la page détail
  - marquer comme **vu / à voir**
  - supprimer
  - **tri** (champ + asc/desc)
- ⬆️ Bouton **retour en haut** pour améliorer l’UX sur les longues listes

---

## 🧱 Stack & choix techniques

- **React + Vite** : DX rapide, HMR
- **React Router** : navigation SPA + routes dynamiques (`/detail/:id`)
- **TMDB API** : données films + crédits
- Architecture simple et lisible :
  - `src/services/` : appels API (client + endpoints)
  - `src/store/` : persistance Watchlist (LocalStorage)
  - `src/components/` : UI réutilisable (cards, empty state, etc.)

---

## 🚀 Installation & lancement

1) Installer les dépendances :
```bash
npm install
