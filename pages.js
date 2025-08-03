import { render } from "./render.js";
import { newTree, loadList, deleteTree, saveTree } from "./newtree.js";
import { returnImage } from "./steam.js";
import { read_tree } from "./file_helper.js";

// --------------------------------------------
// Boot / Initialization
// --------------------------------------------

const treeCanvasHTML = `
  <svg id="tree" width="100%" height="100%">
    <g id="treeGroup"></g>
  </svg>
`;

const state = {
    selectedTreeName: "",
    currentTree: null
}

const container = document.getElementById("treeContainer");
const selectTree = document.getElementById("selectTree");
const deleteBtn = document.getElementById("deleteTrees");
const newTreeBtn = document.getElementById("newTree");

document.addEventListener("DOMContentLoaded", init);

function init() {
   console.log("Renderer loaded!");
   attachEventListeners();
   attachTreeSelectHandlers();
   populateTreeSelect();
}

function attachEventListeners() {
   document.getElementById("newTree").addEventListener("click", showNewTreeForm);
   attachDeleteHandler();
}

// --------------------------------------------
// New Tree Creation
// --------------------------------------------

function showNewTreeForm() {
  
  const template = document.getElementById('newTreeTemplate');
  const clone = template.content.cloneNode(true);
  clearUI();
  container.innerHTML = '';
  container.appendChild(clone);


  const treeForm = container.querySelector("#treeForm");
  const treeTitleInput = container.querySelector("#treeTitle");
  const gameNameInput = container.querySelector("#gameName");
  const addGameBtn = container.querySelector("#addGameBtn");
  const gamesList = container.querySelector("#gamesList");

  if (!treeForm || !treeTitleInput || !gameNameInput || !addGameBtn || !gamesList) {
    console.error("One or more form elements not found");
    return;
  }
  
  const gameNames = [];

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

    if (!treeTitle) return alert("Please enter a tree title");
    if (gameNames.length === 0) return alert("Please add at least one game");

    state.tree = newTree(treeTitle, [...gameNames]);
    populateTreeSelect();
    displayTree();
  });
  
}

// --------------------------------------------
// Select Tree
// --------------------------------------------

function attachTreeSelectHandlers() {
  const treeSelector = document.getElementById("selectTree");
  //treeSelector.addEventListener("change", handleTreeSelect);
  treeSelector.addEventListener("click", handleTreeSelect);
}

async function handleTreeSelect(event) {
  const selected = event.target.value;
  state.selectedTreeName = selected;
  clearUI();

  if (!selected || selected === "nothing") {
    document.getElementById("treeGroup").innerHTML = "";
    state.tree = null;
    return;
  }
  //state.tree needs to be tree object WILL FIX
  state.currentTree = await read_tree(selected);
  displayTree();
}

async function populateTreeSelect(){
  let temp = ``;
  let list = await loadList();
  
  if(list.length == 0) {
    document.getElementById("selectTree").innerHTML = "<option value='nothing'>No Trees Loaded</option>";
    console.error("List is empty");
    return;
  }

  for(let i = 0; i < list.length; i++){
    let name = list[i];
    name = name.substr(0,name.length-5);
    let base = `<option value="${name}">${name}</option>`;
    temp = temp + base;
  }

  document.getElementById("selectTree").innerHTML = temp;
}

// --------------------------------------------
// Delete Tree
// --------------------------------------------

function attachDeleteHandler() {
  const deleteBtn = document.getElementById("deleteTrees");
  deleteBtn.addEventListener("click", handleDeleteTree);
}

async function handleDeleteTree() {
  if (!state.selectedTreeName || state.selectedTreeName === "nothing") {
    alert("No tree selected to delete.");
    return;
  }

  const confirmed = confirm("Are you sure you want to permanently delete this tree?");
  if (!confirmed) return;

  await deleteTree(state.selectedTreeName);

  state.selectedTreeName = "";
  state.currentTree = null;

  clearUI();
  populateTreeSelect();
}

// --------------------------------------------
// Display Tree
// --------------------------------------------

function displayTree() {
  
  if (!state.currentTree) {
    clearUI();
    return;
  }

  container.innerHTML = treeCanvasHTML;

  requestAnimationFrame(() => {
    render(state.currentTree.root, state.currentTree);
  });
}

// --------------------------------------------
// Helper Functions
// --------------------------------------------

function clearUI() {
  
  container.innerHTML = "";
  document.getElementById("points").innerHTML = "";
  document.getElementById("titleContainer").innerHTML = "";
  document.getElementById("imageContainer").innerHTML = "";
  document.getElementById("buttonContainer").innerHTML = "";
  
}
