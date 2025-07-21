import {Node} from "./node.js"
import {Tree} from "./tree.js"
//import {fetchGame, fetchRandomGame} from "./steam.js"

const options = {
    steam: true
}

function reviveNode(obj) {
  const node = new Node(obj.game, obj.numChildren);
  node.children = obj.children.map(reviveNode);
  return node;
}

function loadTrees() {
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

function saveTree(tree) {
  const trees = loadTrees();
  trees.push(tree);
  localStorage.setItem("trees", JSON.stringify(trees));
}

export function newTree(treeName, gameNames) {
    
    let root = new Node(gameNames.shift(), Math.random() < 0.5 ? 3 : 4);
    root.unlock();

    let nodes = [root];
    let itr = 0;

    while (gameNames.length > 0){
        let temp = new Node(gameNames.shift(), Math.random() < 0.5 ? 2 : 3);
        nodes[itr].push(temp);
        nodes.push(temp);
        
        if(nodes[itr].numChildren == nodes[itr].children.length){
            itr++;
        }
    }
    
    let tree = new Tree(root, treeName);
    return root;
    //saveTree(tree);
}