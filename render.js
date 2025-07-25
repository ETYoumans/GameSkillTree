import { renderGameBox } from "./gameContainer.js";
import { saveTree } from "./newtree.js";
const nodeRadius = 30;
const k = 1;

function drawNode(svg, x,y, name, node, root, render, tree){
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ellipse.setAttribute("cx", x);
    ellipse.setAttribute("cy", y);
    ellipse.setAttribute("r", nodeRadius*k);

    if(node.locked){
        ellipse.classList.add("lockedNode");
    }
    else{
        if (node.completed){
            ellipse.classList.add("node");
        }
        else {
            ellipse.classList.add("currentNode")
        }
        
    }
    
    g.appendChild(ellipse);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 4);
    text.setAttribute("textLength", 2*k*nodeRadius - 2*k);
    text.setAttribute("lengthAdjust", "spacingAndGlyphs");
    
    let temp = name;
    if(name.length > 20){
        temp = name.substring(0,17) + "...";
    }
    
    text.textContent = temp;
    
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
    const points = document.getElementById("points");
    const svg = document.getElementById("tree");
    const group = document.getElementById("treeGroup");
    const container = document.getElementById("treeContainer");
    const bounds = container.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    requestAnimationFrame(() => {
        if(tree.points > 0){
            
            points.innerHTML = "Unlock Available!";
        }
        else {
            points.innerHTML = "";
        }
        saveTree(tree);

        group.innerHTML = "";
        draw(group, root, centerX, centerY, 1, 0, 2 * Math.PI, root, render, tree);
        panAndZoom();
    });
    
}

document.addEventListener("DOMContentLoaded", () => {
  panAndZoom();
});

function panAndZoom(){
    const svg = document.getElementById("tree");
    const group = document.getElementById("treeGroup");

    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    let scale = 1;

    svg.addEventListener("mousedown", (e) => {
        isPanning = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    svg.addEventListener("mousemove", (e) => {
        if (!isPanning) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            translateX += dx;
            translateY += dy;
            startX = e.clientX;
            startY = e.clientY;
            updateTransform();
    });

    svg.addEventListener("mouseup", () => { isPanning = false; });
    svg.addEventListener("mouseleave", () => { isPanning = false; });

    svg.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomFactor = 0.1;
        const direction = e.deltaY > 0 ? -1 : 1;
        scale += direction * zoomFactor;
        scale = Math.max(0.1, Math.min(5, scale)); // clamp scale
        updateTransform();
    }, {passive: false});

    function updateTransform() {
    group.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${scale})`);
    }
}


