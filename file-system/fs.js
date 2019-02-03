/* utility functions */
function createNode ({type, name, content = ""}) {
    let node = {
        type: type, // d: directory, f: file
        name: name
    };
    
    if (type === "d") {
        node.children = [];
    } else {
        node.content = content;
    }
  
    return node;
}

function print (message) {
    console.log(message);
}

function throwError (message) {
    throw new Error(message);
}

/* utility functions end */

function createFileSystem () {
    let root = createNode({type: "d", name: "/"});
    let workingDirectory = root;
    let directoryPath = root.name;

    /* private functions */

    let findChild = function (parentNode, childName) {
        return parentNode.children.find(n => n.name === childName);
    }

    let getNode = function (path) {
        let directories = path.split("/");
        let node = root;

        for (let i = 0; i < directories.length; i++) {
            directories[i] && (node = findChild(node, directories[i]));
        }

        return node;
    }

    let traverseFileSystem = function (node, level) {
        print(" ".repeat(level) + node.name);
        if (node.children) {
            node.children.forEach(n => traverseFileSystem(n, level + 1));
        }
    }

    /* private functions end */
    
    let listFiles = function () {
        if (workingDirectory.children) {
            print(workingDirectory.children.map(node => node.name).join("\n"));
        } else {
            return "No files found";
        }
    };
    
    let printWorkingDirectory = function () {
        print(directoryPath);
    };
    
    let makeDirectory = function (name) {
        let node = createNode({type: "d", name: name});
        workingDirectory.children.push(node);
    };
    
    let createFile = function (name, content) {
        let node = createNode({type: "f", name: name, content: content});
        workingDirectory.children.push(node);
    };
    
    let removeFile = function (name) {
        let { children } = workingDirectory;
        workingDirectory.children = children.filter(node => node.name !== name);
    };
    
    let changeDirectory = function (path) {
        if (path.startsWith("/")) {
            if (path === "/") {
                /* root node */ 
                workingDirectory = root;
                return;
            }
        
            let node = getNode(path);

            if (node) {
                workingDirectory = node;
                directoryPath = path;
            } else {
                throwError("Directory not found")
            }
        } else {
            let { children } = workingDirectory;
            let node = children.find(node => node.name === path);
            
            if (!node || node.type !== "d") {
                throwError("Not a valid directory!");
            }
            
            directoryPath += `${node.name}/`;
            workingDirectory = node;
        }
    };
    
    let viewFile = function (fileName) {
        let { children } = workingDirectory;
        let node = children.find(node => node.name === fileName);
        
        if (!node || node.type !== "f") {
            throwError("Not a valid file!");
        }
        
        print(node.content);
    };
    
    let moveFile = function (source, dest) {
        let parentPath = source.slice(0, source.lastIndexOf("/"));
        let sourceParent = parentPath ? getNode(parentPath) : root;
        let sourceNode = getNode(source);
        let destNode;

        if (!sourceNode) {
            throwError("Source not found");
        }
        
        if (dest === "/") {
            /* root node */
            destNode = root;
        } else {
            destNode = getNode(dest);
        }

        if (!destNode || destNode.type !== "d") {
            throwError("Destination should be a directory");
        }

        /* move to destination */
        destNode.children.push(sourceNode);

        /* remove from source */
        sourceParent.children = sourceParent.children.filter(node => node.name !== sourceNode.name);
    };
    
    let viewFs = function() {
        traverseFileSystem(root, 0)
    }

    return {
        ls: listFiles,
        pwd: printWorkingDirectory,
        mkdir: makeDirectory,
        create: createFile,
        rm: removeFile,
        cd: changeDirectory,
        cat: viewFile,
        mv: moveFile,
        viewFs: viewFs
    }
}

let fs = createFileSystem();

console.log("ROOT");
fs.create("f1", "F1 : Hello World");
fs.cat("f1");
fs.mkdir("d1");
fs.mkdir("d2");
fs.mkdir("d3");
fs.ls();
fs.pwd();

console.log("\nLEVEL 1")
fs.cd("d1");
fs.create("f11", "F11 : Hello World");
fs.cat("f11");
fs.mkdir("d11");
fs.ls();
fs.pwd();

console.log("\nLEVEL 2");
fs.cd("d11");
fs.create("f111", "F111 : Hello World");
fs.cat("f111");
fs.mkdir("d111");
fs.ls();
fs.pwd();

console.log("\n");
fs.cd("/d1");
fs.pwd();
fs.ls();

console.log("\n BACK TO ROOT");
fs.cd("/");
fs.pwd();
fs.ls();

console.log("\n FILE SYSTEM");
fs.viewFs();

console.log("\n MOVE FILE");
fs.mv("/d1/d11", "/d2");

console.log("\n FILE SYSTEM");
fs.viewFs();

console.log("\nREMOVING FILE");
fs.rm("f1");
fs.ls();
