# Projet — Paradeyes Coming Soon

## Objectif
Landing temporaire premium hébergée sur paradeyesagency.com jusqu'au lancement du site complet en juin 2026.

## Stack
- Next.js 16 + App Router + src directory
- TypeScript strict
- Tailwind CSS v4 (config via @theme dans globals.css)
- Framer Motion pour animations premium
- Fontes : Satoshi (Fontshare) + DM Sans (Google Fonts) + Instrument Serif (Google Fonts, pour accents)
- Déploiement : Vercel
- Organisation GitHub : paradeyes-studio

## Identité visuelle (STRICTE)
- Dark Green : #023236 (fond principal)
- Electric Green : #57EEA1 (accent)
- Blanc : #FFFFFF (textes)
- Pas d'autres couleurs dans la landing.

## Assets disponibles
- public/logos/paradeyes-logo.svg (logo complet PARADEYES avec typo)
- public/logos/paradeyes-eye.svg (œil seul avec crochet + vague + étoile)

## Direction créative — Landing premium

### Composition cible
Minimalisme radical type Mazarine × Linear × Vokode.
Le visuel signature domine : gradient radial electric green émergeant du bas-centre sur fond dark green.
Le logo œil Paradeyes au centre en grand format (300 à 400 px), avec animation breathing subtile.

### Structure verticale
1. Logo Paradeyes complet (petit, top-left, 64 px du top et left)
2. Espace vide généreux
3. Logo œil centré au centre de la page (300 à 400 px)
4. Sous le logo œil : "Une nouvelle agence arrive." en Satoshi 20 à 24 px blanc
5. Ligne date : "Juin 2026" en electric green italic (Instrument Serif ou Satoshi italic)
6. Espace
7. Email cliquable : hello@paradeyesagency.com
8. Bottom : icônes LinkedIn + Instagram discrètes (blanc 50% opacity)

### Animations attendues
1. Gradient radial qui respire lentement (cycle 8s, scale/position légère)
2. Logo œil qui breathing (scale 1 à 1.05 en 4s)
3. Parallaxe souris sur le gradient (le halo suit légèrement le curseur, 10% max)
4. Cascade d'entrée : logo → œil → texte → date → email → socials (delays 0.3s, 1s, 2s, 2.4s, 2.8s, 3.2s)
5. Hover sur email : underline electric green qui se dessine

### Règles absolues
- Pas de tirets dans les textes
- Vouvoiement
- Pas d'emojis
- Police par défaut Satoshi, pas Inter/Roboto/Helvetica
- Gradient TOUJOURS signature Paradeyes, jamais gradient linéaire basique
- Animations premium easings : cubic-bezier(0.22, 1, 0.36, 1)

### Gradient signature (code CSS à utiliser)
```css
background:
  radial-gradient(
    ellipse 100% 70% at 50% 100%,
    rgba(87, 238, 161, 0.45) 0%,
    rgba(87, 238, 161, 0.25) 25%,
    rgba(87, 238, 161, 0.08) 55%,
    transparent 80%
  ),
  #023236;
```

## Structure des fichiers
```
src/
├── app/
│   ├── layout.tsx              # Fontes + metadata SEO
│   ├── page.tsx                # Landing complète (client component)
│   ├── globals.css             # Tailwind v4 + @theme + animations
│   └── icon.svg                # Favicon œil Paradeyes
├── components/
│   ├── ParadeyesLogo.tsx       # Logo complet (inline SVG, avec typo)
│   ├── ParadeyesEye.tsx        # Logo œil seul animé
│   ├── GradientBackground.tsx  # Gradient signature animé avec parallaxe souris
│   └── SocialIcons.tsx         # LinkedIn + Instagram
└── lib/
    └── constants.ts            # Constantes (email, URLs sociales, etc.)
```

## Meta SEO

### Metadata
- Title : "Paradeyes Agency"
- Description : "Agence créative au service de votre croissance. Une nouvelle agence arrive. Parlons de votre projet : hello@paradeyesagency.com"
- Open Graph : title, description, url, type website, locale fr_FR
- Twitter : summary_large_image
- Theme color : #023236

### Favicon
SVG de l'œil Paradeyes en electric green sur fond dark green (déjà dans src/app/icon.svg).

## Workflow commits
- Commits en anglais format "feat/fix/chore: description"
- npm run build avant chaque commit
- git push après chaque commit logique

## Après le lancement
Cette landing sera remplacée par le site complet paradeyes-website en juin 2026. Le domaine paradeyesagency.com basculera alors sur le nouveau projet Vercel.
