export class Tree {
    constructor(root, treename, numGamesTotal, layers){
        this.root = root;
        this.treename = treename;
        this.layers = layers;
        this.points = 2;
        this.numGamesTotal = numGamesTotal;
        this.numCompleted = 0;
    }
}