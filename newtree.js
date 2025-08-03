//const { Node } = require('./treenode.js');
import { Node } from './treenode.js';
import { Tree } from "./tree.js";
import { read_tree, write_tree, delete_tree, list_trees } from "./file_helper.js";

const testTitles = [
  "Hollow Knight","Celeste","LISA: The Painful","Spelunky 2","Undertale","Dead Cells","Hades","Slay the Spire","Enter the Gungeon","Katana ZERO",
  "The Binding of Isaac","Risk of Rain 2","Hyper Light Drifter","Darkest Dungeon","Baba Is You","Stardew Valley","Terraria","Cuphead","Don't Starve",
  "Outer Wilds","Gris","The Messenger","Ori and the Blind Forest","INSIDE","A Short Hike","FEZ","Hotline Miami","Return of the Obra Dinn","The Talos Principle",
  "Loop Hero","Mario 64","Papers, Please","Little Nightmares","Rain World","Limbo","Spiritfarer","Superliminal","Stanley Parable","Oxenfree","Firewatch",
  "Journey","Broforce","Shovel Knight","Rogue Legacy","Ape Out","Moonlighter","Into the Breach","Vampire Survivors","Noita","Teleglitch","Mad Father",
  "OneShot","To the Moon","Death’s Door","Bug Fables","Ender Lilies","Omori","Rainy Season","Pathologic 2","CrossCode","Spirit Engine 2",

  "Hollow Knight: Silksong","Blasphemous","Children of Morta","Transistor","Bastion","Graveyard Keeper","Rogue Legacy 2","ATOM RPG","Tunic","Dicey Dungeons",
  "Tales of Maj’Eyal","Caves of Qud","Yuppie Psycho","Skul: The Hero Slayer","Carrion","My Friend Pedro","Salt and Sanctuary","Nuclear Throne","Heat Signature","CryoFall",
  "Dandara","Sea of Solitude","Hell is Other Demons","Eastward","Unworthy","Unsighted","Rogue AI Simulator","Detention","VA-11 HALL-A","Signal Simulator",
  "Dungeon Munchies","Black Future '88","Gunpoint","Ghost Song","Neverending Nightmares","Sundered","This War of Mine","Her Story","The Swapper","Iconoclasts",
  "Momodora: Reverie Under the Moonlight","The Final Station","Yoku’s Island Express","The Flame in the Flood","Inmost","Figment","Far: Lone Sails","Shelter","Braid","Zenge",
  "Detour Bus","Exo One","Observation","Catherine Classic","Kenshi","Eternal Threads","Gorogoa","Rain World: Downpour","Unpacking","Pentiment",

  "Katana Kami","Weird West","World of Horror","Death Trash","Undungeon","Griftlands","Despot’s Game","Out There Somewhere","Tormented Souls","Remnants of the Rift",
  "Citizen Sleeper","NORCO","Roadwarden","Fear and Hunger","Inscryption","Super Meat Boy","The Forgotten City","Barotrauma","Mount & Blade II: Bannerlord","Cris Tales",
  "Sunless Sea","Sunless Skies","Wildermyth","Tharsis","Fell Seal: Arbiter's Mark","Battle Brothers","Darkwood","Phantom Abyss","Subnautica","Driftmoon",
  "One Step From Eden","UnderMine","For the King","Slasher's Keep","West of Dead","Nova Drift","Star Renegades","Tangledeep","Dead In Vinland","Hand of Fate 2",
  "Sanabi","Iron Lung","Door Kickers","Tower of Guns","Time Spinner","The Long Dark","Ministry of Broadcast","The Banner Saga","The Banner Saga 2","The Banner Saga 3",
  "GreedFall","The Ascent","Cloudpunk","The Longest Journey","Dreamfall: The Longest Journey","Anodyne","Axiom Verge","Seraph’s Last Stand","Rift Wizard", "Super Mario Sunshine",

  "Stories Untold","Echo","Recompile","Quadrilateral Cowboy","Narita Boy","Lost Ruins","Endling: Extinction is Forever","Backbone","Before Your Eyes","Say No! More",
  "Heaven Will Be Mine","If Found...","Paradise Killer","Kentucky Route Zero","Doki Doki Literature Club","Milk inside a bag of milk inside a bag of milk","Milk outside a bag of milk outside a bag of milk","The Cat Lady","Downfall","Distraint",
  "Claire","Lone Survivor","Gray Dawn","Fran Bow","Whispers of a Machine","Still There","Rakuen","Finding Paradise","Sky: Children of the Light","Never Alone",
  "Hue","The Unfinished Swan","Journey to the Savage Planet","Bound","Shape of the World","The Pathless","Arise: A Simple Story","OMNO","The Artful Escape","Season: A Letter to the Future",
  "Sable","Venba","Chicory: A Colorful Tale","Beacon Pines","Tinykin","Anodyne 2","Everhood","Wuppo","World to the West","Bokida: Heartfelt Reunion",
  "Lightmatter","Scanner Sombre","Antichamber","Manifold Garden","Infini","Viewfinder","The Pedestrian","Supraland","Etherborn","The Witness"
];


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

export function newTree(treeName, gameNames) {

    if (treeName = "test2"){
      gameNames = testTitles;
    }

    let size = gameNames.length;
    gameNames.sort(() => Math.random()-0.5);
    let root = new Node("", Math.random() < 0.5 ? 3 : 4, true, false, true, "");
    root.depth = 0;
    let nodes = [root];
    let itr = 0;

    root.locked = false;
    root.completed = true;

    let maxDepth = 0;

    while (gameNames.length > 0){
        /*
        let temp = new Node(gameNames.shift(), Math.random() < 0.5 ? 2 : 3, true, false, false, "");
        nodes[itr].push(temp);
        nodes.push(temp);
        
        if(nodes[itr].numChildren == nodes[itr].children.length){
            itr++;
        }
        */

        let eligible = nodes.filter(n => n.children.length < n.numChildren && n.depth < maxDepth);

        let parent;

        if (eligible.length === 0) {
          maxDepth++;
          const candidates = nodes.filter(n => n.children.length < n.numChildren);
          if (candidates.length === 0) break;
          parent = candidates[Math.floor(Math.random() * candidates.length)];
        } else {
          parent = eligible[Math.floor(Math.random() * eligible.length)];
        }

        let child = new Node(gameNames.shift(), Math.random() < 0.5 ? 2 : 3, false, false, false, "");
        child.depth = parent.depth + 1;
        parent.push(child);
        nodes.push(child);
    }
    
    let layers = calcLayersSize(root, [0], 0);
    let tree = new Tree(root, treeName, size, layers);
    saveTree(tree);
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