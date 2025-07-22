const titleContainer = document.getElementById("titleContainer");
const imageContainer = document.getElementById("imageContainer");
const buttonContainer = document.getElementById("buttonContainer");
const pointContainer = document.getElementById("pointCount");

function displayTitle(title){
    titleContainer.innerHTML = `<h1>${title}</h1>`
}

function displayImage(title){

}

function displayButtons(svg, node, tree, root, render){
    buttonContainer.innerHTML = "";
    if(node.locked){
        buttonContainer.innerHTML = `<button type="button" id="unlockButton">Unlock</button>`;
        unlockButton.addEventListener("click", () => {
            if(tree.points > 0){
                tree.points -= 1;
                node.unlock();
                svg.innerHTML = "";
                render(root, tree);
            }
            else{
                console.log("Not enough points");
            }
            
        });
    }
    else if(!node.completed){
        buttonContainer.innerHTML = `<button type="button" id="completeButton">Complete</button>`;
        completeButton.addEventListener("click", () => {
            if(!node.completed){
                tree.points += 1;
                pointContainer.innerHTML = tree.points;
                node.completed = true;
                buttonContainer.innerHTML = `<h3>COMPLETED!</h3>`;
            }
        });
    }
    else{
        buttonContainer.innerHTML = `<h3>COMPLETED!</h3>`;
    }
}

export function renderGameBox(svg, tree, node, root, render){
    displayTitle(node.game);
    displayImage(node.game);
    displayButtons(svg, node, tree, root, render);
}