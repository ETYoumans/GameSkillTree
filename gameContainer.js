import {saveTree} from "./newtree.js"

const titleContainer = document.getElementById("titleContainer");
const imageContainer = document.getElementById("imageContainer");
const buttonContainer = document.getElementById("buttonContainer");
const points = document.getElementById("points");
import { returnImage } from "./steam.js";

function displayTitle(title){
    titleContainer.innerHTML = `<h1>${title}</h1>`
}

async function displayImage(title){
    let image = await returnImage(title);
    imageContainer.innerHTML = `<img src=${image} />`
}

function displayButtons(svg, node, tree, root, render){
    buttonContainer.innerHTML = "";
    if(node.locked){
        buttonContainer.innerHTML = `<button type="button" id="unlockButton">UNLOCK</button>`;
        unlockButton.addEventListener("click", () => {
            if(tree.points > 0){
                tree.points -= 1;
                node.locked = false;
                svg.innerHTML = "";
                render(root, tree);
                displayButtons(svg, node, tree, root, render);
            }
            else{
                console.log("Not enough points");
            }
            saveTree(tree);
            
        });
    }
    else if(!node.completed){
        buttonContainer.innerHTML = `<button type="button" id="completeButton">COMPLETE</button>`;
        completeButton.addEventListener("click", () => {
            if(!node.completed){
                tree.points += 1;
                node.completed = true;
                render(root, tree);
                displayButtons(svg, node, tree, root, render);

            }
        });
    }
    else{
        buttonContainer.innerHTML = `<h3>COMPLETED</h3>`;
    }
}

export function renderGameBox(svg, tree, node, root, render){
    displayTitle(node.game);
    displayImage(node.game);
    displayButtons(svg, node, tree, root, render);
}