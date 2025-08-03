import { renderGameBox } from "./gameContainer.js";
import { saveTree } from "./newtree.js";
const nodeRadius = 30;
const K = 1;

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

function draw(svg, node, parentX, parentY, depth, root, render, tree, layers, centerX, centerY) {
    if (layers[depth] === undefined) layers[depth] = 0;
    if(node.children.length == 0){
        return;
    }
    const angleStep = 2*Math.PI / tree.layers[depth + 1];
    if (!tree.layers[depth]) {
        console.warn(`Invalid tree.layers[${depth}]`, tree.layers);
        return;
    }
    const children = node.children || [];

    let k = 2;
    const ringRadius = ((k*depth)+1) * nodeRadius * 5;
    console.log(`Depth: ${depth}, Layers[depth]: ${layers[depth]}, AngleStep: ${angleStep}`);
    console.log(`centerX: ${centerX}, centerY: ${centerY}`);

    if(!node.locked){
        const startIndex = layers[depth];
        children.forEach((child, i) => {
            const angle = angleStep * (startIndex + i) - Math.PI / 2;
            const normalizedAngle = ((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
            const childX = centerX + ringRadius * Math.cos(normalizedAngle);
            const childY = centerY + ringRadius * Math.sin(normalizedAngle);

            console.log(`Normalized Angle: ${normalizedAngle}, ChildX: ${childX}, ChildY: ${childY}`);


            if(child.children.length > 0){
                drawLine(svg, parentX, parentY, childX, childY);
            }
            
            
            draw(svg, child, childX, childY, depth + 1, root, render, tree, layers, centerX, centerY);
        });
    }
    layers[depth] += children.length;
    drawNode(svg, parentX, parentY, node.game, node, root, render, tree);

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

        draw(group, root, centerX, centerY, 0, root, render, tree, [], centerX, centerY);
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
        scale = Math.max(0.1, Math.min(5, scale));
        updateTransform();
    }, {passive: false});

    function updateTransform() {
    group.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${scale})`);
    }
}


