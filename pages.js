import { render } from "./render.js";
import { newTree } from "./newtree.js";

const staticGames = [
  "Minecraft", "Fortnite", "Among Us", "League of Legends", "Valorant",
  "Call of Duty", "Counter-Strike", "Roblox", "Genshin Impact", "Overwatch",
  "GTA V", "The Sims 4", "Apex Legends", "Rocket League", "Elden Ring",
  "Terraria", "Hades", "Stardew Valley", "Animal Crossing", "Mario Sunshine"
];

let tree = newTree("1", [...staticGames]);

const container = document.getElementById("treeContainer");

const newTreeForm = `
<form id="treeForm">
  <label>
    Tree Title: <br/>
    <input type="text" id="treeTitle" required />
  </label>
  <br/><br/>
  <label>
    Add Game Name: <br/>
    <input type="text" id="gameName" />
    <button type="button" id="addGameBtn">Add Game</button>
  </label>
  <br/><br/>
  <div>
    <strong>Games List:</strong>
    <ul id="gamesList"></ul>
  </div>
  <br/>
  <button type="submit">Create Tree</button>
</form>
`;

const displayTreeHTML = `<svg id="tree"></svg>`;

document.getElementById("newTree").addEventListener("click", () => {
  container.innerHTML = newTreeForm;

  const treeForm = document.getElementById("treeForm");
  const treeTitleInput = document.getElementById("treeTitle");
  const gameNameInput = document.getElementById("gameName");
  const addGameBtn = document.getElementById("addGameBtn");
  const gamesList = document.getElementById("gamesList");

  let gameNames = [];

  addGameBtn.addEventListener("click", () => {
    const gameName = gameNameInput.value.trim();
    if (gameName) {
      gameNames.push(gameName);
      updateGamesList();
      gameNameInput.value = '';
      gameNameInput.focus();
    }
  });

  function updateGamesList() {
    gamesList.innerHTML = '';
    gameNames.forEach((game, index) => {
      const li = document.createElement("li");
      li.textContent = game;
      li.style.cursor = "pointer";
      li.title = "Click to remove";
      li.addEventListener("click", () => {
        gameNames.splice(index, 1);
        updateGamesList();
      });
      gamesList.appendChild(li);
    });
  }

  treeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const treeTitle = treeTitleInput.value.trim();

    if (!treeTitle) {
      alert("Please enter a tree title");
      return;
    }
    if (gameNames.length === 0) {
      alert("Please add at least one game");
      return;
    }

    root = newTree(treeTitle, [...gameNames]);
    container.innerHTML = displayTreeHTML;
    requestAnimationFrame(() => {
      render(root);
    });
  });
});

document.getElementById("displayTree").addEventListener("click", () => {
  container.innerHTML = displayTreeHTML;
  requestAnimationFrame(() => {
    render(tree.root, tree);
  });
});
