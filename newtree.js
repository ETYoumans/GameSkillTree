import {Node} from "./node.js"
import {Tree} from "./tree.js"
import {fetchGame, fetchRandomGame} from "./steam.js"

const options = {
    steam: true
}

export function newTree(gameNames) {
    
    let root = new Node(gameNames.shift(), Math.random() < 0.5 ? 3 : 4);

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
    
    return root;

}