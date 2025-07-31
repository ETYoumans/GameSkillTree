//const { Node } = require('./treenode.js');
import { Node } from './treenode.js';
import { Tree } from "./tree.js";
import { read_tree, write_tree, delete_tree } from "./file_helper.js";

function reviveNode(obj) {
  if (!obj || typeof obj !== 'object') {
    return null;
  }

  const node = new Node(obj.game, obj.numChildren, obj.locked, obj.completed);
  node.children = obj.children.length != 0
    ? obj.children.map(reviveNode)
    : [];
  return node;
}

export function loadTrees(treeName) {
  const parsed = read_tree(treeName);
  console.log(parsed);
  return parsed.map(obj => {
    const root = reviveNode(obj.root);
    const tree = new Tree(root, obj.treename);
    tree.points = obj.points;
    return tree;
  });
}

export function saveTree(tree) {
  write_tree(tree.treename, tree);
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
  delete_tree(selectedName);
}