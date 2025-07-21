const svg = document.getElementById("tree");
const container = document.getElementById("treeContainer");
const bounds = container.getBoundingClientRect();
const centerX = bounds.width / 2;
const centerY = bounds.height / 2;
const nodeRadius = 30;

function drawNode(x,y, name){
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", nodeRadius);
    circle.classList.add("node");
    g.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 4);
    text.textContent = name;
    text.classList.add("label");
    g.appendChild(text);

    svg.appendChild(g);
}

function drawLine(x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  svg.appendChild(line);
}

function draw(node, x, y, depth = 1, angleStart = 0, angleEnd = 2 * Math.PI) {
    
    const children = node.children || [];
    const angleStep = (angleEnd - angleStart) / Math.max(children.length, 1);
    const radius = 80 * depth;

    children.forEach((child, i) => {
    const angle = angleStart + i * angleStep + angleStep / 2;
    const offset = 50
    const childX = x + (radius + offset) * Math.cos(angle);
    const childY = y + (radius + offset) * Math.sin(angle);
    drawLine(x, y, childX, childY);
    draw(child, childX, childY, depth + 1, angle - angleStep / 2, angle + angleStep / 2);
    });
    drawNode(x, y, node.game);

}

export function render(root){
    draw(root, centerX, centerY);
}