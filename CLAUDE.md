# Mamie-Thé

Blog Hugo monolingue (FR) sur le thé en vrac, les tisanes et les rituels d'infusion, servi sur <https://www.mamie-the.fr/>. Thème maison dans `themes/mamie-the/`.

> Si un fichier `CLAUDE.local.md` existe à la racine, le lire aussi : il porte les consignes locales, non versionnées, et elles priment.

## Le site

- **Auteur unique** : Hélène Vasseur (`helene-vasseur`, défini dans `data/authors.yaml`). Elle signe tous les articles, à la première personne quand elle témoigne de son usage. Ne jamais ajouter une autre signature.
- **Catégories** : Bienfaits et santé, Préparation et matériel, Variétés de thé, Tisanes et plantes, Culture et rituels. Le dossier d'une page de catégorie porte le terme accentué, l'URL sort sans accents (`removePathAccents = true`).
- **Pages outils** alimentées par `data/` : guide d'infusion (`infusion.yaml`), glossaire (`glossaire.yaml`), quiz « Trouver mon thé » (`quiz.yaml`).
- **Bienfaits et santé** : témoignage d'usage et état des connaissances, jamais de promesse thérapeutique, jamais de posologie, jamais de posture de soignant. Une infusion ne remplace pas un avis médical.

## Articles

Fichiers dans `content/blog/<slug>.md`. Slug en minuscules, sans accents, mots séparés par des tirets.

Frontmatter :

```yaml
title: "..."            # title rendu = title + " | Mamie-Thé" (12 caractères)
date: 2026-11-20
publishDate: 2026-11-20
lastmod: 2026-11-20
description: "..."      # meta description
excerpt: "..."          # chapeau affiché dans les cartes
image: "/images/blog/<slug>.webp"
imageAlt: "..."
imageCredit: "Photo par ... via ..."
author: helene-vasseur
categories: ["Préparation et matériel"]
tags: ["...", "..."]
icon: "cup"             # pictogramme de themes/mamie-the/layouts/partials/icon.html
faq:
  - q: "..."
    a: "..."
```

- **Budget du title** : 60 caractères sur le title **rendu**, suffixe compris, donc **48 caractères au maximum** dans le frontmatter.
- **Dates** : `buildFuture = false`, un article à `publishDate` future reste masqué jusqu'à sa date. Une date nue est lue comme minuit UTC : pour une publication le jour même, utiliser une date horodatée avec fuseau explicite (`2026-09-16T00:30:00+02:00`).
- **Accents obligatoires** dans tout le contenu.
- **FAQ** : le champ `faq` génère le schéma FAQPage, 3 questions au minimum.
- **Maillage interne** : au moins 3 liens contextuels vers d'autres articles du blog, ancre contenant le mot-clé de l'article visé. Uniquement vers des articles déjà publiés ou de date antérieure.

## Images

- Hero obligatoire, récupéré par `.claude/scripts/fetch-image.sh "<requête>" "<slug>"` (Pexels, Unsplash, Wikimedia Commons, Openverse, puis placeholder de charte généré par `make-placeholder.py`). Le script tient le registre anti-doublon `.claude/hero-sources.json`.
- Les clés API sont lues dans l'environnement (`PEXELS_API_KEY`, `UNSPLASH_ACCESS_KEY`) ou dans le fichier désigné par `IMAGE_KEYS_ENV_FILE`. Aucune clé dans le repo, il est public.
- **Contrôle visuel obligatoire** avant publication : le titre d'un fichier ne garantit pas ce que montre l'image.

## Roadmap

`roadmap.yaml` liste les mots-clés à traiter, leur catégorie, leur date et leur statut. Son en-tête documente son format.

## Build et déploiement

```bash
hugo server                          # http://localhost:1313/
hugo --quiet -d "$(mktemp -d)"       # build de contrôle
```

- Toujours builder sans erreur avant de committer.
- Push sur `main` : GitHub Actions build et déploie sur GitHub Pages (Hugo 0.161.1 extended). Un cron mardi et vendredi à 4 h UTC relance le build pour révéler les articles programmés.
- Les pages légales sont reliées depuis le pied de page, entre les marqueurs `legal-links:start` et `legal-links:end` de `footer.html`.
