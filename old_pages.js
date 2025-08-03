import { render } from "./render.js";
import { newTree, loadList, deleteTree, saveTree } from "./newtree.js";
import { returnImage } from "./steam.js";


const displayTreeHTML = `
  <svg id="tree" width="100%" height="100%">
    <g id="treeGroup"></g>
  </svg>
`;


const container = document.getElementById("treeContainer");
let selectedName = "";
let tree = null;
updateSelect();

document.getElementById("deleteTrees").addEventListener("click", () => {
    if(confirm("Are you sure you want to permanently delete this tree?")){
      
      deleteTree(selectedName);
      
      requestAnimationFrame(() => {
        container.innerHTML = "";
        updateSelect();
        document.getElementById("points").innerHTML = "";
        document.getElementById("titleContainer").innerHTML = "";
        document.getElementById("imageContainer").innerHTML = "";
        document.getElementById("buttonContainer").innerHTML = "";
        
      });
      
    }
    
  })

document.getElementById("selectTree").addEventListener("change", selectTreeHandler);
document.getElementById("selectTree").addEventListener("click", selectTreeHandler);

function selectTreeHandler(){

  selectedName = event.target.value;

  if(selectedName == null || selectedName == ""){
    document.getElementById("treeGroup").innerHTML = "";
    return;
  }

  displayTree();
  document.getElementById("titleContainer").innerHTML = "";
  document.getElementById("imageContainer").innerHTML = "";
  document.getElementById("buttonContainer").innerHTML = "";
}


document.getElementById("newTree").addEventListener("click", () => {
  container.innerHTML = newTreeForm;
  requestAnimationFrame(() => {
    document.getElementById("points").innerHTML = "";
    document.getElementById("titleContainer").innerHTML = "";
    document.getElementById("imageContainer").innerHTML = "";
    document.getElementById("buttonContainer").innerHTML = "";
  });

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

    tree = newTree(treeTitle, [...gameNames]);
    updateSelect();
    displayTree();
  });
});

function displayTree(){
  container.innerHTML = displayTreeHTML;
  requestAnimationFrame(() => {
    render(tree.root, tree);
  });
}


function updateSelect(){
  let temp = ``;
  let trees = loadList();
  
  if(trees.length == 0){
    document.getElementById("selectTree").innerHTML = "<option value='nothing'>No Trees Loaded</option>";
    return;
  }

  for(let i = 0; i < trees.length; i++){
    let name = trees[i];
    let base = `<option value="${name}">${name}</option>`;
    temp = temp + base;
  }

  document.getElementById("selectTree").innerHTML = temp;
  
}

