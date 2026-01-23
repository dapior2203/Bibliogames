// ÉTAT DU JEU
const game = {
  score: 0, // Trump total
  tpc: 1, // Trump par click
  tps: 0, // Trump par seconde
  upgrades: {
    tpcUpgradeLvl: 0,
  },
};

//UPGRADE TPC
const tpcUpgrade = {
  level: 0,
  baseCost: 10,
  costMultiplier: 1.5, // +50% à chaque achat
  augmentationParLvl: 1,
};

function getTpcUpgradeCost() {
  return Math.floor(
    tpcUpgrade.baseCost * tpcUpgrade.costMultiplier ** tpcUpgrade.level,
  );
}

//SÉLECTEURS
const element = {
  score: document.querySelector(".trump-cost"),
  trumpImage: document.querySelector(".trump-image"),
  tpcText: document.querySelector("#tpc-text"),
  tpsText: document.querySelector("#tps-text"),
  upgradesContainer: document.querySelector("#upgrades-container"),
  upgradeTemplate: document.querySelector("#upgrade-template"),
  buyTpcBtn: document.querySelector("#buy-tpc-upgrade"),
  tpcUpgradeCostText: document.querySelector("#tpc-upgrade-cost"),
};

//UI
function updateTpcUpgradeUI() {
  const cost = getTpcUpgradeCost();

  if (element.tpcUpgradeCostText) {
    element.tpcUpgradeCostText.textContent = cost;
  }

  if (element.buyTpcBtn) {
    element.buyTpcBtn.disabled = game.score < cost;
  }
}

function updateUI() {
  if (element.score) element.score.textContent = Math.floor(game.score);
  if (element.tpcText) element.tpcText.textContent = game.tpc;
  if (element.tpsText) element.tpsText.textContent = game.tps;

  updateTpcUpgradeUI();
}

//SAUVEGARDE AUTO
function autoSave() {
  game.upgrades.tpcUpgradeLvl = tpcUpgrade.level;
  localStorage.setItem("trump_clicker_save", JSON.stringify(game));
}

//CHARGEMENT AUTO
function autoLoad() {
  const raw = localStorage.getItem("trump_clicker_save");
  if (!raw) return;

  try {
    const data = JSON.parse(raw);

    game.score = Number(data.score) || 0;
    game.tpc = Number(data.tpc) || 1;
    game.tps = Number(data.tps) || 0;
    game.upgrades = data.upgrades || { tpcUpgradeLvl: 0 };

    tpcUpgrade.level = Number(game.upgrades.tpcUpgradeLvl) || 0;
  } catch (e) {
    console.error("Sauvegarde corrompue :", e);
  }
}

//CLIC PRINCIPAL
function onTrumpClick() {
  game.score += game.tpc;
  updateUI();
  autoSave();
}

//ACHAT UPGRADE TPC
function buyTpcUpgrade() {
  const cost = getTpcUpgradeCost();
  if (game.score < cost) return;

  game.score -= cost;
  tpcUpgrade.level += 1;
  game.tpc += tpcUpgrade.augmentationParLvl;

  updateUI();
  autoSave();
}

//TPS
let autoIncomeInterval = null;

function startAutoIncome() {
  if (autoIncomeInterval) return;

  autoIncomeInterval = setInterval(() => {
    if (game.tps > 0) {
      game.score += game.tps;
      updateUI();
      autoSave();
    }
  }, 1000);
}

//ÉVÉNEMENTS
if (element.trumpImage) {
  element.trumpImage.addEventListener("click", onTrumpClick);
}

if (element.buyTpcBtn) {
  element.buyTpcBtn.addEventListener("click", buyTpcUpgrade);
}

//DÉMARRAGE
autoLoad();
updateUI();
startAutoIncome();
