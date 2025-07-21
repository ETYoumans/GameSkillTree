import {render} from "./render.js"
import {newTree} from "./newtree.js"

const gameNames = [
  "Minecraft",
  "Fortnite",
  "Among Us",
  "League of Legends",
  "Valorant",
  "Call of Duty",
  "Counter-Strike",
  "Roblox",
  "Genshin Impact",
  "Overwatch",
  "GTA V",
  "The Sims 4",
  "Apex Legends",
  "Rocket League",
  "Elden Ring",
  "Terraria",
  "Hades",
  "Stardew Valley",
  "Animal Crossing",
  "Mario Sunshine"
];

let root = newTree(gameNames);

render(root);
