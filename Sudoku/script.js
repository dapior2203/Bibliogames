window.onload = function () {
  const BANQUE_DE_GRILLES = [
    [
      [0, 6, 0, 3, 0, 0, 8, 7, 1],
      [0, 0, 0, 0, 9, 0, 2, 0, 0],
      [0, 0, 5, 7, 2, 6, 0, 4, 0],

      [0, 0, 0, 0, 0, 0, 1, 3, 2],
      [7, 4, 3, 0, 6, 2, 0, 9, 0],
      [2, 0, 1, 0, 0, 8, 0, 0, 0],

      [5, 8, 0, 0, 1, 3, 4, 2, 0],
      [0, 0, 0, 0, 0, 0, 9, 1, 5],
      [0, 7, 9, 0, 5, 4, 0, 8, 0],
    ],
    [
      [0, 9, 7, 0, 0, 0, 5, 2, 0],
      [3, 0, 2, 0, 1, 0, 8, 0, 0],
      [0, 6, 0, 4, 2, 7, 1, 0, 0],

      [0, 0, 0, 0, 3, 0, 0, 4, 0],
      [7, 0, 4, 5, 0, 0, 6, 0, 0],
      [0, 1, 9, 7, 0, 0, 3, 0, 8],

      [9, 0, 0, 0, 0, 1, 4, 0, 0],
      [8, 0, 0, 3, 4, 0, 2, 7, 0],
      [0, 7, 0, 2, 5, 6, 9, 8, 0],
    ],
  ];

  let grille = [];
  let modeAssistance = false;

  function creerGrille() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let caseSudoku = document.createElement("input");
        caseSudoku.type = "number";
        document.getElementById("sudoku-container").appendChild(caseSudoku);
        caseSudoku.dataset.row = i;
        caseSudoku.dataset.col = j;
        caseSudoku.value = grille[i][j] === 0 ? "" : grille[i][j];
        if (grille[i][j] !== 0) {
          caseSudoku.readOnly = true;
          caseSudoku.style.fontWeight = "bold";
          caseSudoku.style.backgroundColor = "#e0e0e0";
        }
        caseSudoku.addEventListener("input", function () {
          let l = parseInt(this.dataset.row);
          let c = parseInt(this.dataset.col);
          let n = parseInt(this.value);

          if (isNaN(n) || n < 1 || n > 9) {
            this.value = "";
            grille[l][c] = 0;
          } else {
            grille[l][c] = n;
          }

          // On demande à la grille de se mettre à jour visuellement
          actualiserCouleurs();
          TableauFull();
        });
      }
    }
  }

  function verifierDoublon(plateau, ligne, colonne, chiffre) {
    // 1. Vérification de la ligne
    for (let j = 0; j < 9; j++) {
      if (plateau[ligne][j] === chiffre) return false;
    }

    // 2. Vérification de la colonne
    for (let i = 0; i < 9; i++) {
      if (plateau[i][colonne] === chiffre) return false;
    }

    // 3. Vérification du carré 3x3
    let debutLigne = ligne - (ligne % 3);
    let debutCol = colonne - (colonne % 3);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Ici, on part du "début" du carré et on ajoute i et j
        if (plateau[debutLigne + i][debutCol + j] === chiffre) {
          return false;
        }
      }
    }

    // Si on arrive ici, le chiffre est valide !
    return true;
  }

  function verifierVictoire() {
    let estComplet = true;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let valeur = grille[i][j];

        grille[i][j] = 0;
        if (valeur === 0 || !verifierDoublon(grille, i, j, valeur)) {
          estComplet = false;
        }
        grille[i][j] = valeur;
      }
    }

    if (estComplet) {
      alert("Félicitations ! Vous avez gagné !");
    } else {
      alert("La grille est incomplète ou contient des erreurs.");
    }
  }

  function genererPartie() {
    // 1. Choisir un index au hasard
    let indexAleatoire = Math.floor(Math.random() * BANQUE_DE_GRILLES.length);

    // 2. Copier la grille choisie dans notre variable de jeu 'grille'
    // On utilise JSON.parse/stringify pour créer une copie propre et indépendante
    grille = JSON.parse(JSON.stringify(BANQUE_DE_GRILLES[indexAleatoire]));

    // 3. Nettoyer l'affichage et recréer
    document.getElementById("sudoku-container").innerHTML = "";
    creerGrille();
  }

  function actualiserCouleurs() {
    const inputs = document.querySelectorAll("#sudoku-container input");

    inputs.forEach((input) => {
      let l = parseInt(input.dataset.row);
      let c = parseInt(input.dataset.col);
      let n = parseInt(input.value);

      // 1. GESTION DU MODE OFF OU CASE VIDE
      if (!modeAssistance || isNaN(n)) {
        // Si la case est une case de départ (readOnly), on garde le gris, sinon blanc
        input.style.backgroundColor = input.readOnly ? "#e0e0e0" : "white";
        return;
      }

      // 2. GESTION DU MODE ON (ASSISTANCE)
      let valeurTemp = grille[l][c];
      grille[l][c] = 0;

      if (verifierDoublon(grille, l, c, n)) {
        // Si c'est valide, on remet la couleur normale (gris si verrouillé, blanc sinon)
        input.style.backgroundColor = input.readOnly ? "#e0e0e0" : "white";
      } else {
        // Si c'est un doublon, on met le rouge (même si c'est une case grise !)
        input.style.backgroundColor = "#ff5050";
      }

      grille[l][c] = valeurTemp;
    });
  }

  function TableauFull() {
    let estComplet = true;
    console.log("TableauFull");

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let valeur = grille[i][j];

        grille[i][j] = 0;
        if (valeur === 0) {
          estComplet = false;
        }
        grille[i][j] = valeur;
      }
    }

    if (estComplet) {
      verifierVictoire();
    }
  }

  function startGame() {
    // document
    //   .getElementById("btn-check")
    //   .addEventListener("click", verifierVictoire);
    document
      .getElementById("btn-generate")
      .addEventListener("click", genererPartie);
    document
      .getElementById("btn-assistance")
      .addEventListener("click", function () {
        modeAssistance = !modeAssistance; // On inverse (OFF -> ON ou ON -> OFF)

        // Optionnel : changer l'apparence du bouton pour montrer l'état
        this.textContent = modeAssistance
          ? "Assistance : ON"
          : "Assistance : OFF";
        this.style.backgroundColor = modeAssistance ? "#4CAF50" : "#ccc";

        actualiserCouleurs();
      }); // On rafraîchit l'affichage immédiatement
    genererPartie();
  }
  startGame();
};
