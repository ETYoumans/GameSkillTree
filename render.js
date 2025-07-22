import { renderGameBox } from "./gameContainer.js";

const nodeRadius = 30;


function drawNode(svg, x,y, name, node, root, render, tree){
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", nodeRadius);

    if(node.locked){
        circle.classList.add("lockedNode");
    }
    else{
        circle.classList.add("node");
    }
    
    g.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 4);
    text.textContent = name;
    text.classList.add("label");
    g.appendChild(text);

    g.addEventListener("click", () => {
        renderGameBox(svg, tree, node, root, render);
    })

    svg.appendChild(g);
}

function drawLine(svg, x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  svg.appendChild(line);
}

function draw(svg, node, x, y, depth = 1, angleStart = 0, angleEnd = 2 * Math.PI, root, render, tree) {
    const children = node.children || [];
    const angleStep = (angleEnd - angleStart) / Math.max(children.length, 1);
    const radius = 80 * depth;

    if(!node.locked){
        children.forEach((child, i) => {
        const angle = angleStart + i * angleStep + angleStep / 2;
        const offset = 50
        const childX = x + (radius + offset) * Math.cos(angle);
        const childY = y + (radius + offset) * Math.sin(angle);
        drawLine(svg, x, y, childX, childY);
        draw(svg, child, childX, childY, depth + 1, angle - angleStep / 2, angle + angleStep / 2, root, render, tree);
    });
    }
    
    drawNode(svg, x, y, node.game, node, root, render, tree);

}

export function render(root, tree){
    const pointContainer = document.getElementById("pointCount");
    const svg = document.getElementById("tree");
    const container = document.getElementById("treeContainer");
    const bounds = container.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    pointContainer.innerHTML = tree.points;

    svg.innerHTML = "";
    draw(svg, root, centerX, centerY, 1, 0, 2*Math.PI, root, render, tree);

}