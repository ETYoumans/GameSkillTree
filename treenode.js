export class Node {
    constructor(game, numChildren, locked, completed){
        this.game = game;
        this.locked = locked;
        this.completed = completed;
        this.numChildren = numChildren;
        this.children = [];
    }

    push(node){
        if (!(node instanceof Node)) {
            throw new Error("Only Node instances can be pushed as children.");
        }
        this.children.push(node);
    }
}