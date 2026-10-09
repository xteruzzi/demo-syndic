# Gestion de copropriétés — démonstration statique

Démonstration cliquable d'une application de comptabilité et de gestion pour syndics de copropriété
(espace cabinet + extranet copropriétaires). Site 100 % statique : HTML, CSS et un peu de JavaScript,
sans framework, sans serveur, sans étape de compilation et sans dépendance externe.

**Toutes les données sont fictives et rien n'est enregistré** : les boutons d'action affichent
« Démonstration : action non enregistrée ». La date du jour dans la démo est le 9 octobre 2026.

## Publier sur GitHub Pages

1. Créez un dépôt sur GitHub et poussez-y le contenu de ce dossier (à la racine du dépôt, branche `main`).
2. Dans le dépôt : **Settings → Pages**.
3. *Build and deployment* → **Source : Deploy from a branch**.
4. **Branch : `main`**, dossier **`/ (root)`**, puis **Save**.
5. Après une à deux minutes, le site est en ligne à `https://<utilisateur>.github.io/<dépôt>/`.

Tous les liens sont relatifs : le site fonctionne dans un sous-dossier, en local
(ouvrir `index.html`) ou derrière n'importe quel serveur statique. Le fichier `.nojekyll`
demande à GitHub Pages de servir les fichiers tels quels.

## Comptes de démonstration

| Espace   | Identifiant            | Mot de passe       | Profil |
|----------|------------------------|--------------------|--------|
| Cabinet  | `gestion@demo.fr`      | `Demo-syndic-2026` | Gestionnaire |
| Cabinet  | `compta@demo.fr`       | `Demo-syndic-2026` | Comptable : double authentification, n'importe quel code à 6 chiffres |
| Extranet | `marie.dupont@demo.fr` | `Demo-syndic-2026` | Copropriétaire, lot C1 |
| Extranet | `linh.nguyen@demo.fr`  | `Demo-syndic-2026` | Conseil syndical, lot C3 (voit les relevés bancaires) |

Le profil choisi est mémorisé dans le `localStorage` du navigateur. Il sert seulement à afficher
le bon nom et à réserver certains boutons (valider une facture, signer une reprise) au comptable.

## Contenu

```
index.html                 Accueil et visite guidée
cabinet/                   Back-office du cabinet
  login.html, immeubles.html, utilisateurs.html, journal-audit.html
  tilleuls/                Résidence Les Tilleuls (une page par rubrique du menu)
  clos-des-vignes/         Le Clos des Vignes (reprise d'un nouveau client)
extranet/                  Site des copropriétaires (lecture seule)
assets/style.css           Styles (thème clair et sombre)
assets/demo.js             Toasts, connexion simulée, onglets, dialogues
assets/docs/               PDF fictifs (avis d'appel, relance, factures, PV, contrats…) et fichiers SEPA XML
```
