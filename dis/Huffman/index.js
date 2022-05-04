"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const Stack_1 = __importDefault(require("../Stack"));
class Huffman {
    constructor(toBeCompared) {
        this.rootNode = undefined;
        this.toBeCompared = "";
        this.huffmenCode = "";
        this.toBeCompared = toBeCompared;
        // this.rootNode = this.GenerateHuffmanTree(
        //     this.GetAllNodesFromLeafNode(
        //         this.GetLeafNodesFromString(toBeCompared)
        // ));
    }
    /// string to {key: string, freq: number}[] 
    ///eg huffman => [{h,1}, {f,2}, {u,1}, {f,1}, {m,1}, {a,1}]
    GetLeafNodesFromString(toBeCompared) {
        toBeCompared = toBeCompared == undefined ? this.toBeCompared : toBeCompared;
        let arr = [];
        let charArr = this.toBeCompared.split("");
        charArr.forEach(char => {
            // char = char.toLowerCase();
            let index = arr.findIndex(element => element.key === char);
            if (index === -1) {
                arr.push({
                    key: char,
                    freq: 1
                });
            }
            else {
                arr[index].freq++;
            }
        });
        return arr;
    }
    /// join two leaf nodes to a parent node
    /// [{n,1},{f,1}] => {right: { left: { key: 'n', freq: 1 }, right: { key: 'f', freq: 2 }, sun: 3 },sun: 7}
    GetAllNodesFromLeafNode(arr) {
        let nodes = [];
        if (arr.length === 0)
            return nodes;
        for (let index = 0; index < (arr.length); index++) {
            const element1 = arr[index];
            const element2 = arr[(++index % arr.length)];
            const parentNode = {
                left: element1,
                right: element2,
                sun: element1.freq + element2.freq,
            };
            nodes.push(parentNode);
        }
        return nodes;
    }
    /// join two nodes to a parent node and join the parent node to other nodes to make a tree
    GenerateHuffmanTree(arr) {
        let rootNode = this.rootNode;
        for (let index = 0; index < (arr.length - 1); index++) {
            var element1 = rootNode == undefined ? arr[index] : rootNode;
            var element2 = arr[index + 1];
            // console.log("element1 ", element1);
            // console.log("element2 ", element2);
            if (!rootNode)
                rootNode = this.JoinNode(element1, element2);
            else
                rootNode = this.JoinNode(rootNode, element2);
        }
        this.rootNode = rootNode;
        return rootNode;
    }
    GetHuffmanCode(node) {
        /// if reverse extract tree use it else use internal tree
        const rootNode = node == undefined ? this.rootNode : node;
        // if rootNode is undefined return empty string
        if (rootNode == undefined) {
            this.huffmenCode = "";
            return "";
        }
        ;
        /// two stacks 
        /// one for managing the nodes(tree traversing) [printStack]
        /// the other for managing the huffman code [codeStack]
        const printStack = new Stack_1.default();
        const codeStack = new Stack_1.default();
        /// push the root node to the printStack
        printStack.push(rootNode);
        /// string => char[]
        // let charArr: string[] = this.getPureString(this.GetLeafNodesFromString(this.toBeCompared)).split("");
        let charArr = this.toBeCompared.split("");
        /// loop for each char in the string, get the huffman code push it to the codeStack
        charArr.forEach((char) => {
            // console.log("char ", char);
            // reset the printStack
            printStack.clear();
            printStack.push(rootNode);
            /// dir {LEFT: 1, RIGHT: 0}
            /// dir is used to get the left or right child of the parent node
            // start by going left(load and porcess the left child)
            var dir = types_1.NodeDirType.RIGHT;
            /// while the printStack is not empty(as long as there is a node to be processed)
            /// HOW IT WORKS
            /// using the dir load the node from the printStack and push it to the codeStack as long as the node is not a ILeafNode
            /// if the node is a ILeafNode, push the code to the codeStack and break the loop
            for (let i = 0; printStack.length() != 0; i++) {
                const element = printStack.pop();
                //type check[undefined] if undefined [werid] thing happened
                if (element == undefined)
                    break;
                if ((0, types_1.isInstanceOfLeafNode)(element)) {
                    // console.log("[+]ILeafNode [ELEMENT]  ", element.key, "freq ", element.freq);
                    /// if ILeafNode it must contain the key and freq
                    /// check if this is the element we are looking for
                    /// if so break the loop
                    if (element.key === char) {
                        // console.log("[+] [ELEMENT] [FOUND] [", element.key, "]")
                        // console.log("[+] [ELEMENT] [FOUND] [BREAK] ", codeStack.toString());
                        break;
                    }
                    /// if element is not found check the next element(in the stack) 
                    const nextNode = printStack.peek();
                    if (nextNode == undefined)
                        break;
                    /// if the next node is INode type
                    /// this means that we are finshed checking this parent node and it's children for the char, 
                    /// so we need to go back on our steps and switch to the next sibling parent node
                    if ((0, types_1.isInstanceOfNode)(nextNode)) {
                        /// go back on our steps (from ILeafNode to INode)
                        var pop = codeStack.pop();
                        // console.log("\n[+] NEXT IS Node [POP] ", pop == "1" ? "LEFT" : "RIGHT", '\n');
                        /// change the context from ILeaf to parent node
                        pop = codeStack.pop();
                        /// switch to the next sibling parent node
                        /// we do this by inverting the dir(since it's a binary tree there is always left and right child)
                        codeStack.push(pop == "1" ? "0" : "1");
                        /// change first dir in the codeStack to the last fouced dir
                        if (codeStack.length() == 1) {
                            // console.log("[CANAGE ROOT DIR] TO ", dir == 1 ? "LEFT" : "RIGHT", '\n');
                            codeStack.clear();
                            codeStack.push(dir.toString());
                        }
                    }
                    /// if the next node is ILeafNode type
                    /// this means we only checked is first child of the parent node for the char,
                    /// next we need to go back on our steps and switch to the second child of the parent node
                    /// the new dir will propegate
                    else {
                        // toggling dir
                        dir = dir === types_1.NodeDirType.LEFT ? types_1.NodeDirType.RIGHT : types_1.NodeDirType.LEFT;
                        // console.log("[+]NEXT IS LEAF [SWITCH] TO", dir == 1 ? "LEFT" : "RIGHT");
                        codeStack.pop();
                        codeStack.push(dir.toString());
                    }
                    // console.log("[+]codeStack [LOOP END]", codeStack.toString());
                    /// if element is ILeafNode check sibling rather than adding more nodes
                    continue;
                }
                // const nextNode = printStack.peek();
                // if (nextNode == undefined)
                //     // console.log("[+] [NEXT NODE] [EMPTY]");
                // else if (isInstanceOfNode(nextNode) && dir == NodeDirType.LEFT) {
                //     /// if the next node is INode type
                //     /// this means that we are finshed checking this parent node and it's children for the char,
                //     /// so we need to go back on our steps and switch to the next sibling parent node
                //     let pop = codeStack.pop();
                //     pop = codeStack.pop();
                //     codeStack.push(pop?.toString() ?? '');
                // }
                // if element is not a ILeafNode it must be a [INode or undefined]
                const left = element.left;
                const right = element.right;
                /// if dir is left push the left child to the printStack(at the top)
                if (dir == types_1.NodeDirType.LEFT) {
                    printStack.push(right);
                    printStack.push(left);
                }
                /// if dir is right push the right child to the printStack(at the top)
                else {
                    printStack.push(left);
                    printStack.push(right);
                }
                // console.log("[+] codeStack [PUSH] ", dir.toString() == "1" ? "LEFT" : "RIGHT");
                // load the nodes
                codeStack.push(dir.toString());
            }
            // console.log("char ", char, " huffmen code: ", codeStack.toString());
        });
        // console.log("[+] codeStack [DONE]", codeStack.toString());
        /// return the codeStack and ship
        return codeStack.toString();
    }
    /// compress (get huffman code)
    /// first IleafNode[] from input string
    /// sort IleafNode[] by freq
    /// then ILeafNode[] => INode[]
    /// then INode[] => huffman tree
    compress(str) {
        this.toBeCompared = str == undefined ? this.toBeCompared : str;
        let Lnodes = this.GetLeafNodesFromString();
        Lnodes = this.SortLeafNode(Lnodes);
        // console.log("[+] Sorted ILeafNode[] ", Lnodes);
        let nodes = this.GetAllNodesFromLeafNode(Lnodes);
        console.log("[+] nodes ", nodes);
        this.GenerateHuffmanTree(nodes);
        // console.log("[+] huffman tree ", this.rootNode?.left);
        // console.log("[+] huffman tree ", (this.rootNode?.left as INode).left);
        // console.log("[+] huffman tree ", (this.rootNode?.left as INode).right);
        return this.GetHuffmanCode();
    }
    deCompress(code, root) {
        let str = "";
        // "1,0,0" => [1,0,0]
        const codeArray = code.split(",");
        const node = root == undefined ? this.rootNode : root;
        if (node == undefined)
            return "";
        // node used to traverse the tree
        let traversingNode = node;
        /// for each char in the codeArray
        /// traverse either left or right
        /// until the u find a ILeafNode
        /// add the char to the str
        /// loop
        for (let index = 0; index < codeArray.length + 1; index++) {
            const code = codeArray[index];
            if ((0, types_1.isInstanceOfLeafNode)(traversingNode)) {
                // console.log("[+] [FOUND] [LEAF] ", (traversingNode as ILeafNode).key);
                str += traversingNode.key;
                traversingNode = node;
                --index;
            }
            else if ((0, types_1.isInstanceOfNode)(traversingNode)) {
                // console.log("[+] [FOUND] [NODE] going to", code == "1" ? "LEFT" : "RIGHT");
                if (code == types_1.NodeDirType.LEFT.toString()) {
                    traversingNode = traversingNode.left;
                }
                else if (code == types_1.NodeDirType.RIGHT.toString()) {
                    traversingNode = traversingNode.right;
                }
                // console.log("[+] [FOUND] [NODE] ", traversingNode);
            }
            else {
                console.log("[+] [ERROR] [DE-COMPRESS] [UNKNOWN NODE TYPE]");
                break;
            }
        }
        return str;
    }
    // helper function
    JoinNode(root, node) {
        let parentNode;
        parentNode = {
            left: root,
            right: node,
            sun: root.sun + node.sun,
        };
        return parentNode;
    }
    SortLeafNode(arr) {
        return arr.sort((a, b) => {
            if (a.freq > b.freq) {
                return 1;
            }
            else if (a.freq < b.freq) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }
    PrintNode(node) {
        node = node == undefined ? this.rootNode : node;
        if (!node)
            return;
        const printStack = new Stack_1.default();
        printStack.push(node);
        for (let i = 0; printStack.length() != 0; i++) {
            const element = printStack.pop();
            if (element == undefined)
                continue;
            if ((0, types_1.isInstanceOfLeafNode)(element)) {
                console.log("ILeafNode ", element.key, "freq ", element.freq);
                continue;
            }
            const left = element.left;
            const right = element.right;
            printStack.push(left);
            printStack.push(right);
        }
    }
    // return string with out repeating chars
    getPureString(leafs) {
        let str = "";
        leafs.forEach(element => {
            str += element.key;
        });
        return str;
    }
}
exports.default = Huffman;
