export class Node {
    constructor(game, numChildren, locked, completed, first, subtitle){
        this.game = game;
        this.subtitle = subtitle;
        this.locked = locked;
        this.completed = completed;
        this.numChildren = numChildren;
        this.children = [];
        this.first = first;
        this.depth = 0;
    }

    push(node){
        if (!(node instanceof Node)) {
            throw new Error("Only Node instances can be pushed as children.");
        }
        this.children.push(node);
    }
}