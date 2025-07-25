import {Node} from "./node.js"
import {Tree} from "./tree.js"

function reviveNode(obj) {
  if (!obj || typeof obj !== 'object') {
    //console.warn("Invalid node object:", obj);
    return null;
  }

  const node = new Node(obj.game, obj.numChildren, obj.locked, obj.completed);
  node.children = obj.children.length != 0
    ? obj.children.map(reviveNode)
    : [];
  return node;
}

export function loadTrees() {
  const raw = localStorage.getItem("trees");
  if (!raw) return [];

  const parsed = JSON.parse(raw);

  return parsed.map(obj => {
    const root = reviveNode(obj.root);
    const tree = new Tree(root, obj.treename);
    tree.points = obj.points;
    return tree;
  });
}

export function saveTree(tree) {
  const trees = loadTrees();
  for (let i = 0; i < trees.length; i++) {
    if(trees[i].treename === tree.treename){
      trees[i] = tree;
      localStorage.setItem("trees", JSON.stringify(trees));
      return;
    }
  }
  trees.push(tree);
  localStorage.setItem("trees", JSON.stringify(trees));
}

export function newTree(treeName, gameNames) {
    gameNames.sort(() => Math.random()-0.5);
    let root = new Node(gameNames.shift(), Math.random() < 0.5 ? 3 : 4, true, false);

    let nodes = [root];
    let itr = 0;

    while (gameNames.length > 0){
        let temp = new Node(gameNames.shift(), Math.random() < 0.5 ? 2 : 3, true, false);
        nodes[itr].push(temp);
        nodes.push(temp);
        
        if(nodes[itr].numChildren == nodes[itr].children.length){
            itr++;
        }
    }
    
    let tree = new Tree(root, treeName);
    saveTree(tree);
    return tree;
}

export function clearTrees(){
  localStorage.clear();
}

export function deleteTree(selectedName){
  let trees = loadTrees();
  for(let i = 0; i < trees.length; i++){
    if(selectedName == trees[i].treename){
      trees.splice(i,1);
    }
  }
  localStorage.clear();
  localStorage.setItem("trees", JSON.stringify(trees));
}