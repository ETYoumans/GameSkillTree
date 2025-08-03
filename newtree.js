//const { Node } = require('./treenode.js');
import { Node } from './treenode.js';
import { Tree } from "./tree.js";
import { read_tree, write_tree, delete_tree, list_trees, txt_to_list } from "./file_helper.js";

function reviveNode(obj) { //helper function to recreate the parent to child connections (may not be necessary but good backup just in case)
  if (!obj || typeof obj !== 'object') {
    return null;
  }

  const node = new Node(obj.game, obj.numChildren, obj.locked, obj.completed);
  node.children = obj.children.length != 0
    ? obj.children.map(reviveNode)
    : [];
  return node;
}

export function loadTree(treeName) {
  const parsed = read_tree(treeName);
  return parsed.map(obj => {
    const root = reviveNode(obj.root);
    const tree = new Tree(root, obj.treename);
    tree.points = obj.points;
    return tree;
  });
}

export function loadList(){
  return list_trees();
}

export async function saveTree(tree) {
  await write_tree(tree.treename, tree);
}

export async function newTree(upload) {
  //Collecting game list and tree file from txt file
  let obj = await txt_to_list(upload);
  let treeName = obj.treename;
  let gameNames = obj.gamenames;

  console.log(treeName);

  //shuffle game List
  gameNames.sort(() => Math.random()-0.5);

  //create empty node with 3 or 4 children
  let root = new Node("", Math.random() < 0.5 ? 3 : 4, false, false, true, "");
  
  //asign root properties
  root.locked = false;
  root.completed = true;
  root.depth = 0;

  let maxDepth = 0;
  let nodes = [root];
  let size = gameNames.length;

  while (gameNames.length > 0){

    let eligible = nodes.filter(n => n.children.length < n.numChildren && n.depth < maxDepth); //create list of games with room for children and not at max depth

    let parent;

    if (eligible.length === 0) { //enters if all games are at the same depth
      maxDepth++;
      const candidates = nodes.filter(n => n.children.length < n.numChildren); //filter to ensure there is room for more children (should never fail)
      if (candidates.length === 0) break;
      parent = candidates[Math.floor(Math.random() * candidates.length)]; //chose random parent out of candidates
    } else {
      parent = eligible[Math.floor(Math.random() * eligible.length)]; //chose random parent out of candidates
    }

    let child = new Node(gameNames.shift(), Math.random() < 0.5 ? 2 : 3, true, false, false, "");
    child.depth = parent.depth + 1;
    parent.push(child);
    nodes.push(child);
  }
  
  let layers = calcLayersSize(root, [0], 0); //layer size will be used by the renderer
  let tree = new Tree(root, treeName, size, layers);
  saveTree(tree); //writes tree to trees folder
  return tree;
}

function calcLayersSize(node, layers, depth){
  if(layers[depth] === undefined){
    layers[depth] = 0;
  }
  layers[depth] += 1;
  
  node.children.forEach((child) => {
    layers = calcLayersSize(child, layers, depth+1);
  });
  return layers;
}


export function clearTrees(){
  localStorage.clear();
}

export function deleteTree(selectedName){
  delete_tree(selectedName);
}