const COLORS = ["R", "G", "B", "Y", "O", "P"];
const CODE_LENGTH = 4;
const MAX_TRIES = 10;

const secret = generateSecret();
let attempts = 0;

// NEW
let locked = Array(CODE_LENGTH).fill(false);
let currentGuess = Array(CODE_LENGTH).fill(null);

const board = document.getElementById("board");
const currentDiv = document.getElementById("current");
const messageDiv = document.getElementById("message");

// console.log("SECRET:", secret.join("")); // debug

function generateSecret() {
return Array.from({ length: CODE_LENGTH }, () =>
COLORS[Math.floor(Math.random() * COLORS.length)]
);
}

function addColor(color) {
// place la couleur dans la première case non verrouillée
for (let i = 0; i < CODE_LENGTH; i++) {
if (!locked[i] && !currentGuess[i]) {
currentGuess[i] = color;
break;
}
}
renderCurrent();
}

function renderCurrent() {
currentDiv.innerHTML = "";
for (let i = 0; i < CODE_LENGTH; i++) {
const peg = document.createElement("div");
peg.className = "peg";
if (currentGuess[i]) peg.classList.add(currentGuess[i]);
if (locked[i]) peg.style.border = "3px solid black"; // indique verrouillage
currentDiv.appendChild(peg);
}
}

function play() {
// vérifie si toutes les cases non verrouillées sont remplies
if (attempts >= MAX_TRIES) return;

const allFilled = currentGuess.every((c, i) => locked[i] || c);
if (!allFilled) {
messageDiv.textContent = "Remplis toutes les cases non verrouillées !";
return;
}

attempts++;
const feedback = evaluateGuessByPosition(secret, currentGuess);

// verrouille les positions correctes
for (let i = 0; i < CODE_LENGTH; i++) {
if (feedback[i] === "green") {
locked[i] = true;
}
}

renderRow(currentGuess, feedback);

if (feedback.every(f => f === "green")) {
messageDiv.textContent = "🎉 Bravo, tu as gagné !";
} else if (attempts === MAX_TRIES) {
messageDiv.textContent = "❌ Perdu ! Code : " + secret.join("");
}

// prépare le prochain essai (les cases verrouillées restent, les autres deviennent null)
for (let i = 0; i < CODE_LENGTH; i++) {
if (!locked[i]) currentGuess[i] = null;
}
renderCurrent();
}

// ⚙️ Feedback par position : green / yellow / gray
function evaluateGuessByPosition(secret, guess) {
const feedback = Array(CODE_LENGTH).fill("gray");

const secretCopy = [...secret];
const guessCopy = [...guess];

// 1) Green (bien placé)
for (let i = 0; i < CODE_LENGTH; i++) {
if (guessCopy[i] === secretCopy[i]) {
feedback[i] = "green";
secretCopy[i] = null;
guessCopy[i] = null;
}
}

// 2) Yellow (bonne couleur, mauvaise place)
for (let i = 0; i < CODE_LENGTH; i++) {
if (guessCopy[i]) {
const index = secretCopy.indexOf(guessCopy[i]);
if (index !== -1) {
feedback[i] = "yellow";
secretCopy[index] = null;
}
}
}

return feedback;
}

function renderRow(guess, feedback) {
const row = document.createElement("div");
row.className = "row";

guess.forEach(c => {
const peg = document.createElement("div");
peg.className = 'peg ${c}';
row.appendChild(peg);
});

const feedbackDiv = document.createElement("div");
feedbackDiv.className = "feedback";

feedback.forEach(f => {
const dot = document.createElement("div");
dot.className = 'dot ${f}';
feedbackDiv.appendChild(dot);
});

row.appendChild(feedbackDiv);
board.appendChild(row);
}