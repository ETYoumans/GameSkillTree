const path = require('path');
const fs = require('fs');
const readline = require('readline');

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

async function del(treename) {
    const filePath = getFullPath(treename);

    if(!fs.existsSync(filePath)){
        return `File not found: $(filePath)`;
    }

     try {
        fs.unlinkSync(filePath);
        return "Successful deletion";
    } catch (err) {
        return `Failed to delete: ${err.message}`;
    }

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

async function txtReader(upload){
    let exists = fs.existsSync(upload);
    if(!exists){
        console.error(`File (${upload}) cannot be read`);
        return null;
    }

    if(!upload.endsWith(".txt")){
        console.error(`File (${upload}) needs ".txt" extension`);
        return null;
    }

    const file = readline.createInterface({input: fs.createReadStream(upload)});

    let treeName = "";
    let gameNames = [];

    return new Promise((resolve, reject) => {
        file.on('line', (line) => {
            while(line.endsWith(" ")){
                line = line.slice(0,-1);
            }
            while(line.startsWith(" ")){
                line = line.slice(1);
            }

            if (treeName === "") {
                treeName = line;
            } else {
                gameNames.push(line);
            }
        });

        file.on('close', () => {
            resolve({ treename: treeName, gamenames: gameNames });
        });

        file.on('error', (err) => {
            reject(err);
        });
    });

}

module.exports = {
    read,
    write,
    del,
    listdir,
    txtReader,
};
