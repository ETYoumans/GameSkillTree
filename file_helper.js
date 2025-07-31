export async function read_tree(treeName){
    var treedata = await window.treeAPI.read(treeName);
    const tree = JSON.parse(treedata);
    return tree;
} 

export async function write_tree(treeName, tree){
    await window.treeAPI.write(treeName, JSON.stringify(tree));
}

export async function delete_tree(treeName){
    var deleted = await window.treeAPI.delete(treeName);
    if(!deleted){
        console.log("Error: Failed to delete");
    }
}