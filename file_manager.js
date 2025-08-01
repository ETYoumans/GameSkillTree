const path = require('path');
const fs = require('fs');

const _dir = path.join(__dirname, 'trees');
const _ext = '.json';

function ensureDirExists() {
    if (!fs.existsSync(_dir)) {
        fs.mkdirSync(_dir, { recursive: true });
    }
}

function getFullPath(treename) {
    return path.join(_dir, treename + _ext);
}

function read(treename) {
    const filePath = getFullPath(treename);
    return fs.readFileSync(filePath, 'utf8');
}

function write(treename, jsonString) {
    ensureDirExists();
    const filePath = getFullPath(treename);
    fs.writeFileSync(filePath, jsonString, 'utf8');
}

function del(treename) {
    const filePath = getFullPath(treename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
    }
    return false;
}

async function listdir(){
    let folder = path.join(__dirname, 'trees');
    let exists = fs.existsSync(folder);

    if(!exists){
        console.error("Tree Folder does not exist");
        return [];
    }

    let list = [];
    try {
        list = await fs.promises.readdir(folder);
        return list;
    }
    catch (err) {
        console.error('Failed to read dir:', err);
        return list;
    }
}

module.exports = {
    read,
    write,
    del,
    listdir,
};
