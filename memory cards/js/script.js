const cartes = document.querySelectorAll(".cartes");

const symboles = ["☎️","📻","📺","🎞️","💿","🎵","🕰️","🚗"];
let jeu = [...symboles, ...symboles];

// Mélange des symboles
jeu.sort(() => Math.random() - 0.5);

let premiereCarte = null;
let secondeCarte = null;
let bloquer = false;

// Assigner les symboles aux cartes
cartes.forEach((carte, index) => {
    carte.dataset.symbole = jeu[index];

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
    carte.innerHTML = carte.dataset.symbole;
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
            premiereCarte.innerHTML = `<span class="dos-cartes">🃏</span>`;
            secondeCarte.innerHTML = `<span class="dos-cartes">🃏</span>`;
            resetTour();
        }, 900);
    }
}

function resetTour() {
    premiereCarte = null;
    secondeCarte = null;
    bloquer = false;
}
