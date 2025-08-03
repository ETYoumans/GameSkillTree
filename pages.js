import { render, prerender, resetView } from "./render.js";
import { newTree, loadList, deleteTree, saveTree} from "./newtree.js";
import { returnImage } from "./steam.js";
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
`;

const state = {
    selectedTreeName: "",
    currentTree: null
}

const container = document.getElementById("treeContainer");
const selectTree = document.getElementById("selectTree");

document.addEventListener("DOMContentLoaded", init);

function init() {
   console.log("Renderer loaded!");
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
  populateTreeSelect();
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
    console.error("List is empty");
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
// Display Tree
// --------------------------------------------

function displayTree() {
  
  if (!state.currentTree) {
    clearUI();
    return;
  }

  container.innerHTML = treeCanvasHTML;
  document.getElementById("resetViewBtn").addEventListener("click", resetView);
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
