const cartes = document.querySelectorAll(".cartes");
const symboles = [
  "images/carte1.png",
  "images/carte2.png",
  "images/carte3.png",
  "images/carte4.png",
  "images/carte5.png",
  "images/carte6.png",
  "images/carte7.png",
  "images/carte8.png"
];

let jeu = [...symboles, ...symboles];

// Mélange des symboles
jeu.sort(() => Math.random() - 0.5);

let premiereCarte = null;
let secondeCarte = null;
let bloquer = false;

// Assigner les symboles aux cartes
cartes.forEach((carte, index) => {
    carte.dataset.symbole = jeu[index];
    // Ajouter le symbole dans la face de la carte
    const faceCartes = carte.querySelector('.face-cartes');
    const imgPath = jeu[index];
const isSpecial = imgPath.includes("carte7.png");

faceCartes.innerHTML = `
  <img src="${imgPath}" class="img-carte ${isSpecial ? "carte-speciale" : ""}">
`;

    
    carte.addEventListener("click", () => {
        if (bloquer || carte.classList.contains("retournee")) return;
        retournerCarte(carte);
        if (!premiereCarte) {
            premiereCarte = carte;
        } else {
            secondeCarte = carte;
            bloquer = true;
            verifierPaire();
        }
    });
});

function retournerCarte(carte) {
    carte.classList.add("retournee");
}

function verifierPaire() {
    if (premiereCarte.dataset.symbole === secondeCarte.dataset.symbole) {
        premiereCarte.classList.add("trouvee");
        secondeCarte.classList.add("trouvee");
        resetTour();
    } else {
        setTimeout(() => {
            premiereCarte.classList.remove("retournee");
            secondeCarte.classList.remove("retournee");
            resetTour();
        }, 900);
    }
}

function nouvellePartie() {
    // Réinitialiser les variables
    premiereCarte = null;
    secondeCarte = null;
    bloquer = false;
    
    // Remélanger les symboles
    jeu.sort(() => Math.random() - 0.5);
    
    // Réinitialiser les cartes
    cartes.forEach((carte, index) => {
        carte.classList.remove("retournee", "trouvee");
        carte.dataset.symbole = jeu[index];
        carte.querySelector('.face-cartes').innerHTML =
  `<img src="${jeu[index]}" class="img-carte">`;
    });
}

function resetTour() {
    premiereCarte = null;
    secondeCarte = null;
    bloquer = false;
}
