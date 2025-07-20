class Node {
    constructor(game, numChildren){
        this.game = game;
        this.numChildren = numChildren;
        this.children = [];
    }

    push(game){
        this.children.push(game);
    }
}