---

**Problématique** :
*"Actuellement, mon application **CVgen** (générateur de CV en React) utilise `html2canvas` pour capturer le rendu HTML du CV et le convertir en image (PNG/JPEG) ou en PDF via `jsPDF`.
**Problème principal** :
- Les exports en **PNG/JPEG** présentent des **décalages visuels** (logos, texte, boutons mal alignés), probablement dus à :
  - Un rendu incomplet des polices personnalisées ou des images externes (CORS, timing de chargement).
  - Une interprétation partielle du CSS (Flexbox, Grid, `transform`) par `html2canvas`.
- Les exports en **PDF** ne contiennent **aucun texte sélectionnable**, car `html2canvas` génère une image raster (PNG) qui est ensuite intégrée dans le PDF via `jsPDF`.

**Objectif** :
Trouver une solution pour :
1. **Corriger les décalages** dans les exports PNG/JPEG (en optimisant `html2canvas` ou en utilisant une alternative comme `dom-to-image`).
2. **Rendre le texte sélectionnable** dans les exports PDF, en remplaçant l'approche actuelle (`html2canvas` + `jsPDF`) par une solution comme :
   - `@react-pdf/renderer` (100% frontend, texte natif).
   - `window.print()` (solution simple mais moins contrôlable).
   - Un backend avec `puppeteer` (pour un rendu parfait, mais nécessite un serveur)."*

---
---
**Pourquoi c'est important** :
- **Expérience utilisateur** : Un CV exporté doit être **fidèle à l'aperçu** et **modifiable** (texte sélectionnable pour le PDF).
- **Professionnalisme** : Les décalages visuels donnent une impression de manque de finition.

---