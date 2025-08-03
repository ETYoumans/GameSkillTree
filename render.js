import { renderGameBox } from "./gameContainer.js";
import { saveTree } from "./newtree.js";
const nodeRadius = 30;
const K = 1;

const layoutMap = new Map();
let currentRoot = null;
let currentTree = null;

function drawNode(svg, x,y, name, node, root, render, tree){

    if(node.first){
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const diamond = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        let y1 = K*(y + nodeRadius);
        let y2 = K*(y - nodeRadius);
        let x1 = K*(x + nodeRadius);
        let x2 = K*(x - nodeRadius);

        let points = `${x},${y1} ${x1},${y} ${x},${y2} ${x2},${y}`;
        diamond.setAttribute('points', points);

        diamond.classList.add("root");
        g.appendChild(diamond);
        svg.appendChild(g);
    }
    else{
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ellipse.setAttribute("cx", x);
        ellipse.setAttribute("cy", y);
        
        ellipse.setAttribute("r", nodeRadius*K);

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
        text.setAttribute("textLength", 2*K*nodeRadius - 2*K);
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
}

function drawLine(svg, x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  svg.appendChild(line);
}

function draw(svg, node, root, render, tree) {
    const parentPos = layoutMap.get(node);
    let parentX = parentPos.x;
    let parentY = parentPos.y;
 

    let children = node.children;
    if(!node.locked){
        children.forEach((child) => {

            const childPos = layoutMap.get(child);
            let childX = childPos.x;
            let childY = childPos.y;

            drawLine(svg, parentX, parentY, childX, childY);
            
            draw(svg, child, root, render, tree);
        });
    }
    drawNode(svg, parentX, parentY, node.game, node, root, render, tree);

}

let rootX = 0;
let rootY = 0;


export function prerender(root, tree) {
    currentRoot = root;
    currentTree = tree;
    calculateLayout();
}

function calculateLayout(){
    if (!currentRoot || !currentTree) return;
    layoutMap.clear();

    let tree = currentTree;
    let root = currentRoot;

    const container = document.getElementById("treeContainer");
    const bounds = container.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const counters = Array(tree.layers.length).fill(0);
    rootX = centerX;
    rootY = centerY;

    


function recurse(node, depth) {
  let x, y;

  if (depth === 0) {
    x = centerX;
    y = centerY;
  } else {
    const total = currentTree.layers[depth];
    const index = counters[depth]++;
    const angleStep = 2 * Math.PI / total;
    const angle = angleStep * index - Math.PI / 2;

    let k=2;
    if(depth < 3){
        k=1.5;
    }
    const radius = ((k * depth) + 1) * nodeRadius * 5;
    
    x = centerX + radius * Math.cos(angle);
    y = centerY + radius * Math.sin(angle);
  }

  layoutMap.set(node, { x, y });

  node.children.forEach(child => recurse(child, depth + 1));
}

    recurse(root, 0);
}

window.addEventListener("resize", () => {
    if (!currentRoot || !currentTree) return;
    calculateLayout();
    rerender();
});

export function rerender() {
    if (!currentRoot || !currentTree) return;
    render(currentRoot, currentTree);
}

export function render(root, tree){
    const points = document.getElementById("points");
    const svg = document.getElementById("tree");
    const group = document.getElementById("treeGroup");

    const container = document.getElementById("treeContainer");
    const bounds = container.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    translateX = centerX - rootX;
    translateY = centerY - rootY;
    scale = 1;

    requestAnimationFrame(() => {
        if(tree.points > 0){
            
            points.innerHTML = "Unlock Available!";
        }
        else {
            points.innerHTML = "";
        }
        saveTree(tree);

        group.innerHTML = "";

        draw(group, root, root, render, tree);
        panAndZoom();
    });
    
}

document.addEventListener("DOMContentLoaded", () => {
  panAndZoom();
});



let translateX = 0;
let translateY = 0;
let scale = 1;

function panAndZoom(){
    const svg = document.getElementById("tree");
    const group = document.getElementById("treeGroup");

    let isPanning = false;
    let startX = 0;
    let startY = 0;

    const container = document.getElementById("treeContainer");
    const bounds = container.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    translateX = centerX - rootX;
    translateY = centerY - rootY;


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

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;


        const beforeX = (mouseX - translateX) / scale;
        const beforeY = (mouseY - translateY) / scale;

        scale += direction * zoomFactor;
        scale = Math.max(0.1, Math.min(5, scale));

        translateX = mouseX - beforeX * scale;
        translateY = mouseY - beforeY * scale;
        updateTransform();
    }, {passive: false});

    updateTransform();
    
}

export function resetView() {
    scale = 1;

    const container = document.getElementById("treeContainer");
    const bounds = container.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    translateX = centerX - rootX;
    translateY = centerY - rootY;

    updateTransform();
}

function updateTransform() {
    const group = document.getElementById("treeGroup");



    group.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${scale})`);
}
