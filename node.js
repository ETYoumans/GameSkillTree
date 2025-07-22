export class Node {
    constructor(game, numChildren){
        this.game = game;
        this.locked = true;
        this.completed = false;
        this.numChildren = numChildren;
        this.children = [];
    }

    push(game){
        this.children.push(game);
    }

    unlock(){
        this.locked = false;
    }
}