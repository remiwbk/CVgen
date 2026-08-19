# CVgen 🚀

**[🌐 Voir la démo en ligne](https://cv-generator.remidupire.com/)**

> **Générateur de CV personnalisé en ligne** – Crée, personnalise et exporte ton CV au format PNG/JPEG/PDF.

---

## ✨ Fonctionnalités

- **Édition en temps réel** : Modifie ton CV directement dans l'interface.
- **Export multi-format** : Télécharge ton CV en **PNG**, **JPEG** ou **PDF**.
- **Design responsive** : Adapté aux mobiles et ordinateurs.
- **Personnalisation avancée** : Couleurs, polices, mises en page, etc.

---

## 📥 Installation

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

### Étapes

1. **Clone le dépôt** :
  ```bash
   git clone https://github.com/ton-username/CVgen.git
   cd CVgen
  ```
2. **Installe les dépendances** :
  ```bash
   npm install
  ```
3. **Lance l'application** :
  ```bash
   npm start
  ```
  > L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## 🎨 Utilisation

### 1. Personnaliser ton CV

- **Section "Informations"** : Remplis tes coordonnées (nom, prénom, email, etc.).
- **Section "Expérience"** : Ajoute/supprime des expériences professionnelles.
- **Section "Compétences"** : Liste tes compétences avec des icônes.
- **Thème** : Choisis un thème de couleurs dans les paramètres.

### 2. Prévisualisation

- Clique sur **"Aperçu"** pour voir ton CV en temps réel.

### 3. Export

- Clique sur **"Exporter"** et choisis le format :
  - **PNG** : Pour une image haute qualité.
  - **JPEG** : Pour un fichier léger.
  - **PDF** : Pour un document imprimable.

---

## ⚠️ Problèmes connus

### 🐛 Bug : Texte des boutons non centré dans les exports PNG/JPEG

#### **Cause**

Le rendu des boutons via `html2canvas` (ou une bibliothèque similaire) peut ignorer certaines propriétés CSS comme `text-align: center` ou `flexbox` lors de l'export en image.

#### **Solutions**

1. **Forcer le centrage avec Flexbox** :  
 Dans ton fichier CSS (ex: `styles.css`), ajoute :
  ```css
   button {
     display: flex;
     justify-content: center;
     align-items: center;
     width: 100%; /* Assure que le bouton prend toute la largeur */
   }
  ```
2. **Utiliser une police système** :  
 Certaines polices personnalisées ne sont pas correctement rendues. Utilise une police standard :
  ```css
   button {
     font-family: Arial, sans-serif !important;
   }
  ```
3. **Vérifier les options de `html2canvas`** :  
 Si tu utilises `html2canvas` pour l'export, ajoute ces options :
  ```javascript
   html2canvas(element, {
     scale: 2, // Améliore la qualité
     logging: true, // Affiche les erreurs dans la console
     useCORS: true, // Pour les images externes
   });
  ```
4. **Tester avec `dom-to-image`** :  
 Une alternative à `html2canvas` qui gère mieux le CSS :
  ```bash
   npm install dom-to-image
  ```

   Exemple d'utilisation :

---

## 🛠️ Technologies utilisées

- **Frontend** : React, Tailwind CSS
- **Export** : `html2canvas` ou `dom-to-image`
- **Icônes** : [Font Awesome](https://fontawesome.com/) ou [React Icons](https://react-icons.github.io/react-icons/)

---

## 🤝 Contribuer

1. Fork le projet.
2. Crée une branche (`git checkout -b feature/ma-fonctionnalité`).
3. Commit tes changements (`git commit -m "Ajout de X"`).
4. Push vers la branche (`git push origin feature/ma-fonctionnalité`).
5. Ouvre une Pull Request.

---

## 📜 Licence

MIT © [Remiwbk](https://github.com/ton-username)