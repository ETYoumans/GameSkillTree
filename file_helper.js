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
    if(deleted != "Successful deletion"){
        console.error("Error: Failed to delete, " , deleted);
    }
}

export async function txt_to_list(upload) {
    var obj = await window.treeAPI.txt_to_list(upload);
    if(obj == null){
        console.error(`File (${upload}) could not be read`);
        return null;
    }
    if(obj.treename == null || obj.gamenames == null){
        console.error(`Invalid txt structure`);
        return null;
    }
    return obj;
    
}

export async function uploadWindow() {
    return await window.treeAPI.selectUpload();
}

export async function list_trees(){ 
    var list = await window.treeAPI.listdir();
    return list;
}