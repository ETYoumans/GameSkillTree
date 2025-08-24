import {saveTree} from "./newtree.js"

export function clearCache(){
    localStorage.clear();
}

export function fixNumCompleted(tree) {
    let count = 0;
    function traverse(node) {
        if (node.completed) 
            count++;
        else if(!node.locked)
            count += 0.2;

        if (node.children) {
            for (let child of node.children) {
                traverse(child);
            }
        }
    }
    if (tree.root.children) {
        for (let child of tree.root.children) {
            traverse(child);
        }
    }
    tree.numCompleted = count;
    saveTree(tree);
}