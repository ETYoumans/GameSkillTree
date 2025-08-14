import {saveTree} from "./newtree.js"
import { displayCompletionContainer , displayUnlock } from "./pages.js";
const titleContainer = document.getElementById("titleContainer");
const imageContainer = document.getElementById("imageContainer");
const buttonContainer = document.getElementById("buttonContainer");
const points = document.getElementById("points");
import { returnImage } from "./steam.js";

function displayTitle(title, subtitle){
    if(subtitle == '')
        titleContainer.innerHTML = `<h1>${title}</h1>`;
    else
        titleContainer.innerHTML = `<h1>${title}</h1><p>${subtitle}</p>`;
}

async function displayImage(node){
    let image = await returnImage(node);
    imageContainer.innerHTML = `<img src=${image} />`
}

function displayButtons(svg, node, tree, root, render){
    buttonContainer.innerHTML = "";
    if(node.locked){
        buttonContainer.innerHTML = `<button type="button" id="unlockButton">UNLOCK</button>`;
        unlockButton.addEventListener("click", () => {
            if(tree.points > 0){
                tree.points -= 1;
                tree.numCompleted += 0.2; //stores unlocked status in tree
                node.locked = false;
                svg.innerHTML = "";
                render(root, tree, true);
                displayButtons(svg, node, tree, root, render);
                displayUnlock();
            }
            saveTree(tree);
            
        });
    }
    else if(!node.completed){
        buttonContainer.innerHTML = `<button type="button" id="completeButton">COMPLETE</button>`;
        completeButton.addEventListener("click", () => {
            if(!node.completed){
                tree.points++;
                tree.numCompleted -= 0.2; //removes unlocked status in tree
                tree.numCompleted++;
                node.completed = true;
                displayCompletionContainer();
                render(root, tree, true);
                displayButtons(svg, node, tree, root, render);
                displayUnlock();
            }
        });
    }
    else{
        buttonContainer.innerHTML = `<h3>COMPLETED</h3>`;
        displayUnlock();
    }
        
}

export function renderGameBox(svg, tree, node, root, render){
    displayTitle(node.game, node.subtitle);
    displayImage(node);
    displayButtons(svg, node, tree, root, render);
}