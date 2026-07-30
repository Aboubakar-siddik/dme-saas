# Corrections de sécurité — Session du 25 juillet 2026

Ce document liste les failles identifiées lors d'une revue de code du
dépôt `Aboubakar-siddik/dme-saas` (14 commits, branche `master`) et les
correctifs appliqués dans cette version. À garder comme référence et à
mettre à jour à chaque revue future.

## 🔴 Critique — corrigé

### 1. `VisitsController` sans authentification + isolation multi-clinique cassée

**Avant** : aucune route du module `visits` n'exigeait de token JWT
(`@UseGuards(JwtAuthGuard)` absent), et `visits.service.ts` utilisait une
constante codée en dur :

```ts
const DEFAULT_CLINIC_ID = 'clinic_001';
```

**Impact** : n'importe qui sur Internet, sans authentification, pouvait
créer, lire ou modifier des consultations médicales (diagnostic,
prescription, antécédents). De plus, toutes les cliniques auraient partagé
les mêmes données de visite — l'isolation multi-tenant, pourtant une
promesse de sécurité centrale du produit (BF07 / BNF01), n'existait pas
pour ce module.

**Correctif** :
- `@UseGuards(JwtAuthGuard)` ajouté sur `VisitsController`.
- Toutes les méthodes du service acceptent désormais `clinicId` en premier
  paramètre, extrait de `req.user.clinicId` (le token JWT), et l'utilisent
  dans chaque requête Prisma (`findFirst`, `findMany`, `create`).
- Fichiers modifiés : `visits/visits.controller.ts`, `visits/visits.service.ts`.

### 2. Escalade de privilèges via `POST /auth/register`

**Avant** : deux routes permettaient de créer un utilisateur.
`POST /users` vérifiait correctement `role === 'ADMIN'` avant de créer un
compte. `POST /auth/register` était protégée par `JwtAuthGuard` **seul** —
sans vérification de rôle — malgré un commentaire dans le code indiquant
le contraire.

**Impact** : n'importe quel utilisateur authentifié (y compris une
secrétaire) pouvait appeler `/auth/register` avec `{ "role": "ADMIN" }`
et obtenir un compte administrateur.

**Correctif** : route `POST /auth/register` supprimée. La création de
compte passe désormais exclusivement par `POST /users`, seule voie qui
vérifie le rôle de l'appelant. `AuthService` ne gère plus que la connexion.

### 3. Secret JWT par défaut

**Avant** : `env.config.ts` retombait silencieusement sur
`'fallback-secret-do-not-use-in-prod'` si `JWT_SECRET` n'était pas défini
dans `.env`.

**Impact** : un déploiement oubliant de configurer `.env` tournerait avec
un secret public et documenté — n'importe qui pourrait forger des tokens
JWT valides pour n'importe quel utilisateur.

**Correctif** : l'application refuse de démarrer (`throw` explicite) si
`JWT_SECRET` est absent ou fait moins de 16 caractères. Même chose pour
`DATABASE_URL`. Fail fast plutôt que tourner silencieusement en mode non
sécurisé.

## 🟡 Renforcements ajoutés

- **Helmet** : en-têtes HTTP de sécurité de base (anti-clickjacking,
  anti-sniffing MIME) ajoutés dans `main.ts`.
- **CORS restreint** : l'API n'accepte plus les requêtes de n'importe
  quelle origine — seulement `CORS_ORIGIN` (configurable, `.env`).
- **Rate limiting** (`@nestjs/throttler`) : 100 requêtes/minute/IP en
  global, et une limite plus stricte de 10 requêtes/minute/IP spécifiquement
  sur `POST /auth/login` pour freiner le brute-force de mot de passe.
- **Script de bootstrap (`prisma/seed.js`)** : avant ce correctif, il
  n'existait aucun moyen documenté de créer le tout premier compte admin
  (`/users` exige déjà un admin connecté — problème de la poule et de
  l'œuf). Le script crée la première clinique + le premier compte ADMIN en
  une seule commande (`npm run seed`).
- Suppression d'un `console.log` de debug qui confirmait la présence de
  `DATABASE_URL` au démarrage (`prisma.service.ts`) — pas une fuite de
  secret en soi, mais un résidu de débogage à ne pas garder en production.

## 🟢 Déjà correct (vérifié, non modifié)

- `PatientsService` : isolation par `clinicId` correcte partout
  (`findFirst`/`findUnique` avec double filtre systématique).
- Mots de passe jamais renvoyés dans les réponses API
  (`const { passwordHash: _, ...result } = user` systématique).
- `ValidationPipe` global (`whitelist: true`, `forbidNonWhitelisted: true`).
- `.env` correctement exclu de Git dans les trois `.gitignore` du dépôt.

## ⚠️ Connu, non corrigé dans cette session — décision assumée

- **Token JWT stocké dans `localStorage`** côté frontend
  (`AuthContext.tsx`, `api/client.ts`). Expose à un vol de session en cas
  de faille XSS. La correction propre (cookie `httpOnly` + `Secure` +
  `SameSite=Strict`, CSRF token, `credentials: 'include'` côté axios)
  demande une refonte du flux d'authentification frontend + backend. Pour
  un MVP à budget et temps limités, ce n'est pas la priorité immédiate —
  mais **à faire avant tout déploiement avec de vraies données patients**.
  Le CORS restreint + rate limiting réduisent le risque en attendant.

## Recommandations pour la suite (priorité, avant nouvelles fonctionnalités)

1. **Écrire de vrais tests** sur `visits.service.ts` et `patients.service.ts`
   qui vérifient explicitement l'isolation par clinique (ex: créer 2
   cliniques, vérifier qu'un `findOne` avec le mauvais `clinicId` renvoie
   bien 404). C'est exactement ce type de test qui aurait détecté le bug
   n°1 avant qu'il n'atteigne le dépôt.
2. Passer l'authentification en cookie `httpOnly` avant le premier client
   pilote avec de vraies données patients.
3. Ajouter un `RolesGuard` générique (`@Roles('ADMIN')` décorateur) plutôt
   que des `if (role !== 'ADMIN')` dispersés dans les services — plus
   difficile à oublier sur une future route.
