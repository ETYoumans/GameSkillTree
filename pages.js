import { render, prerender, resetView, rerender } from "./render.js";
import { newTree, loadList, deleteTree} from "./newtree.js";
import { read_tree, uploadWindow } from "./file_helper.js";

// --------------------------------------------
// Boot / Initialization
// --------------------------------------------

const treeCanvasHTML = `
  <svg id="tree" width="100%" height="100%">
    <g id="treeGroup"></g>
  </svg>
  <div class="resetContainer">
    <button class="resetViewBtn" id="resetViewBtn"></button>
  </div>
  <div class="settingsContainer">
    <button class="settingsBtn" id="settingsBtn"></button>
  </div>
  <div class="completionContainer" id="completionContainer"></div>
`;

const state = {
    selectedTreeName: "",
    currentTree: null,
    completionPercent: true
}

const container = document.getElementById("treeContainer");
const selectTree = document.getElementById("selectTree");

document.addEventListener("DOMContentLoaded", init);

function init() {
   attachEventListeners();
   attachTreeSelectHandlers();
   populateTreeSelect();
}

function attachEventListeners() {
   document.getElementById("newTree").addEventListener("click", newtreeHandler);
   attachDeleteHandler();
}

// --------------------------------------------
// New Tree Creation
// --------------------------------------------

async function newtreeHandler(){
  const filepath = await uploadWindow();
  state.currentTree = await newTree(filepath);
  state.selectedTreeName = state.currentTree.treename;
  populateTreeSelect();
  selectTree.value = state.selectedTreeName;
  prerender(state.currentTree.root, state.currentTree);
  displayTree();
}

// --------------------------------------------
// Select Tree
// --------------------------------------------

function attachTreeSelectHandlers() {
  const treeSelector = document.getElementById("selectTree");
  treeSelector.addEventListener("change", handleTreeSelect);
}

async function handleTreeSelect(event) {
  const selected = event.target.value;
  state.selectedTreeName = selected;
  clearUI();

  if (!selected || selected === "nothing") {
    //document.getElementById("treeGroup").innerHTML = "";
    state.currentTree = null;
    return;
  }

  state.currentTree = await read_tree(selected);
  prerender(state.currentTree.root, state.currentTree);
  displayTree();
}

async function populateTreeSelect(){
  let temp = `<option value="nothing" selected disabled>Select a tree</option>`;
  let list = await loadList();
  let selectedTree = document.getElementById("selectTree")
  
  if(list.length == 0) {
    selectTree.innerHTML = "<option value='nothing'>No Trees Loaded</option>";
    container.innerHTML = gettingStartCanvasHTML;
    return;
  }

  for(let i = 0; i < list.length; i++){
    let name = list[i];
    name = name.substr(0,name.length-5);
    let base = `<option value="${name}">${name}</option>`;
    temp = temp + base;
  }

  selectedTree.innerHTML = temp;
  selectTree.value = state.selectedTreeName || "nothing";
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
// Display Tree & Total
// --------------------------------------------

function displayTree() {
  
  if (!state.currentTree) {
    clearUI();
    return;
  }

  container.innerHTML = treeCanvasHTML;
  document.getElementById("resetViewBtn").addEventListener("click", resetView);
  document.getElementById("settingsBtn").addEventListener("click", displaySettings);
  displayCompletionContainer();
  requestAnimationFrame(() => {
    render(state.currentTree.root, state.currentTree, false);
  });
}

export function displayCompletionContainer(){
  let completionContainer = document.getElementById("completionContainer");
  completionContainer.addEventListener("click", changeCompletionContainer);
  if(state.completionPercent){
    let percent = Math.floor(state.currentTree.numCompleted) / state.currentTree.numGamesTotal;
    percent = Math.floor(percent * 100);
    completionContainer.innerHTML = `<p>${percent}%</p>`;
  }
  else {
    completionContainer.innerHTML = `<p>${Math.floor(state.currentTree.numCompleted)} / ${state.currentTree.numGamesTotal}</p>`
  }
}

function changeCompletionContainer(){
  if(state.completionPercent)
    state.completionPercent = false;
  else 
    state.completionPercent = true;
  displayCompletionContainer();
}

// --------------------------------------------
// Display Settings 
// --------------------------------------------

const settingsCanvasHTML = `
  <div class="settings">
  <button class="clearCacheBtn" id="clearCacheBtn">Clear Cache</button>
  </br>
  <button class="clearCacheBtn" id="fixTreeBtn">Recount Completed Games</button>
  </br>
  <button class="exitBtn" id="exitBtn">Exit</button>
  </div>
`;

function recountFunction(){
  fixNumCompleted(state.currentTree);
}

import { clearCache, fixNumCompleted } from "./settings.js";

function displaySettings() {
  clearUI();
  container.innerHTML = gettingStartCanvasHTML + settingsCanvasHTML;
  document.getElementById("exitBtn").addEventListener("click", displayTree);
  document.getElementById("clearCacheBtn").addEventListener("click", clearCache);
  document.getElementById("fixTreeBtn").addEventListener("click", recountFunction);
}

// --------------------------------------------
// Display Getting Start Page
// --------------------------------------------

const gettingStartCanvasHTML = `
  <div class="gettingStartContainer">
    <h2>Getting Started: </h2>
    <p>
      This app helps you work through your backlog of games by turning them into interactive skill trees.
    </p>
    <p>
      To get started, create a tree using a txt (you can use notepad): the first line is your tree title, and each subsequent line is a game. 
      Add parentheses to include optional subtitles without affecting images.
      Subtitles can be used for optional goals, such as a randomizer or true ending goal.
    </p>
    <p>
      Once your txt file is made, click on new tree and upload the file.
      This will create a file in the trees folder, which you can navigate find in resources/app/trees.
      You can share this file with others, and they can copy it in their tree folders, or you can use this to update your application.
    </p>
    <p>
      Once your tree is ready, explore it by clicking nodes to view game details, unlock games, and track your progress. 
      Green nodes are unlocked but not yet completed, and completing games unlocks more nodes.
      White nodes are completed games.
      Gray nodes are locked games.
      Use panning, zooming, and the home button to navigate your tree.
    </p>
    <p>
      Check your completion rate in the top right. It can switch between fractions and percentages.
      The settings page is mainly for debugging, allowing you to fix any errors that may occur. 
      This is primarily to fix the tree when updating the application. 
    </p>
    <p>
      Start your first tree and make your backlog a little more fun!
    </p>
  </div>
`;

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
