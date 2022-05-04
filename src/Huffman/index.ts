import { ILeafNode, INode, NodeDirType, isInstanceOfLeafNode, isInstanceOfNode } from "../types";
import Stack from "../Stack";

export default class Huffman {

    private rootNode: INode | undefined = undefined;
    private toBeCompared: string = "";
    private huffmenCode: string = "";

    constructor(toBeCompared: string) {
        this.toBeCompared = toBeCompared;
        // this.rootNode = this.GenerateHuffmanTree(
        //     this.GetAllNodesFromLeafNode(
        //         this.GetLeafNodesFromString(toBeCompared)
        // ));
    }

    /// string to {key: string, freq: number}[] 
    ///eg huffman => [{h,1}, {f,2}, {u,1}, {f,1}, {m,1}, {a,1}]
    public GetLeafNodesFromString(toBeCompared?: string): ILeafNode[] {
        toBeCompared = toBeCompared == undefined ? this.toBeCompared : toBeCompared;
        let arr: ILeafNode[] = [];
        let charArr: string[] = this.toBeCompared.split("");
        charArr.forEach(char => {
            // char = char.toLowerCase();
            let index = arr.findIndex(element => element.key === char);

            if (index === -1) {
                arr.push({
                    key: char,
                    freq: 1
                });
            } else {
                arr[index].freq++;
            }
        });
        return arr;
    }

    /// join two leaf nodes to a parent node
    /// [{n,1},{f,1}] => {right: { left: { key: 'n', freq: 1 }, right: { key: 'f', freq: 2 }, sun: 3 },sun: 7}
    public GetAllNodesFromLeafNode(arr: ILeafNode[]): INode[] {
        let nodes: INode[] = [];
        if (arr.length === 0)
            return nodes;



        for (let index = 0; index < (arr.length); index++) {
            const element1: ILeafNode = arr[index];
            const element2: ILeafNode = arr[(++index % arr.length)];

            const parentNode: INode = {
                left: element1,
                right: element2,
                sun: element1.freq + element2.freq,
            }
            nodes.push(parentNode);
        }

        return nodes;
    }

    /// join two nodes to a parent node and join the parent node to other nodes to make a tree
    public GenerateHuffmanTree(arr: INode[]): INode | undefined {
        let rootNode: INode | undefined = this.rootNode;
        for (let index = 0; index < (arr.length - 1); index++) {
            var element1: INode = rootNode == undefined ? arr[index] : rootNode;
            var element2: INode = arr[index + 1];

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

    public GetHuffmanCode(node?: INode): string {

        /// if reverse extract tree use it else use internal tree
        const rootNode = node == undefined ? this.rootNode : node;

        // if rootNode is undefined return empty string
        if (rootNode == undefined) { this.huffmenCode = ""; return "" };

        /// two stacks 
        /// one for managing the nodes(tree traversing) [printStack]
        /// the other for managing the huffman code [codeStack]
        const printStack: Stack<INode | ILeafNode | undefined> = new Stack<INode | ILeafNode | undefined>();
        const codeStack: Stack<string> = new Stack<string>();

        /// push the root node to the printStack
        printStack.push(rootNode);

        /// string => char[]
        // let charArr: string[] = this.getPureString(this.GetLeafNodesFromString(this.toBeCompared)).split("");
        let charArr: string[] = this.toBeCompared.split("");


        /// loop for each char in the string, get the huffman code push it to the codeStack
        charArr.forEach((char) => {
            // console.log("char ", char);

            // reset the printStack
            printStack.clear();
            printStack.push(rootNode);

            /// dir {LEFT: 1, RIGHT: 0}
            /// dir is used to get the left or right child of the parent node
            // start by going left(load and porcess the left child)
            var dir: number = NodeDirType.RIGHT;

            /// while the printStack is not empty(as long as there is a node to be processed)

            /// HOW IT WORKS
            /// using the dir load the node from the printStack and push it to the codeStack as long as the node is not a ILeafNode
            /// if the node is a ILeafNode, push the code to the codeStack and break the loop

            for (let i = 0; printStack.length() != 0; i++) {

                const element = printStack.pop();

                //type check[undefined] if undefined [werid] thing happened
                if (element == undefined) break;

                if (isInstanceOfLeafNode(element)) {
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
                    if (isInstanceOfNode(nextNode)) {


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
                        dir = dir === NodeDirType.LEFT ? NodeDirType.RIGHT : NodeDirType.LEFT;
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
                const left: INode = (element as INode).left as INode;
                const right: INode = (element as INode).right as INode;


                /// if dir is left push the left child to the printStack(at the top)
                if (dir == NodeDirType.LEFT) {
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

        })

        // console.log("[+] codeStack [DONE]", codeStack.toString());

        /// return the codeStack and ship
        return codeStack.toString()

    }

    /// compress (get huffman code)

    /// first IleafNode[] from input string
    /// sort IleafNode[] by freq
    /// then ILeafNode[] => INode[]
    /// then INode[] => huffman tree
    public compress(str?: string): string {
        this.toBeCompared = str == undefined ? this.toBeCompared : str;

        let Lnodes: ILeafNode[] = this.GetLeafNodesFromString();
        Lnodes = this.SortLeafNode(Lnodes);
        // console.log("[+] Sorted ILeafNode[] ", Lnodes);

        let nodes: INode[] = this.GetAllNodesFromLeafNode(Lnodes);
        console.log("[+] nodes ", nodes);

        this.GenerateHuffmanTree(nodes);
        // console.log("[+] huffman tree ", this.rootNode?.left);
        // console.log("[+] huffman tree ", (this.rootNode?.left as INode).left);
        // console.log("[+] huffman tree ", (this.rootNode?.left as INode).right);



        return this.GetHuffmanCode();
    }

    public deCompress(code: string, root?: INode | ILeafNode | undefined): string {

        let str: string = "";
        // "1,0,0" => [1,0,0]
        const codeArray: string[] = code.split(",");

        const node: INode | ILeafNode | undefined = root == undefined ? this.rootNode : root;
        if (node == undefined) return "";


        // node used to traverse the tree
        let traversingNode: INode | ILeafNode | undefined = node;

        /// for each char in the codeArray
        /// traverse either left or right
        /// until the u find a ILeafNode
        /// add the char to the str
        /// loop
        for (let index = 0; index < codeArray.length + 1; index++) {
            const code = codeArray[index];

            if (isInstanceOfLeafNode(traversingNode)) {
                // console.log("[+] [FOUND] [LEAF] ", (traversingNode as ILeafNode).key);
                str += (traversingNode as ILeafNode).key;
                traversingNode = node;
                --index;
            } else if (isInstanceOfNode(traversingNode)) {
                // console.log("[+] [FOUND] [NODE] going to", code == "1" ? "LEFT" : "RIGHT");
                if (code == NodeDirType.LEFT.toString()) {
                    traversingNode = (traversingNode as INode).left;
                }
                else if (code == NodeDirType.RIGHT.toString()) {
                    traversingNode = (traversingNode as INode).right;
                }
                // console.log("[+] [FOUND] [NODE] ", traversingNode);
            } else {
                console.log("[+] [ERROR] [DE-COMPRESS] [UNKNOWN NODE TYPE]");
                break;
            }

        }

        return str;
    }




    // helper function
    public JoinNode(root: INode, node: INode): INode {
        let parentNode: INode;
        parentNode = {
            left: root,
            right: node,
            sun: root.sun + node.sun,
        }
        return parentNode;
    }

    public SortLeafNode(arr: ILeafNode[]): ILeafNode[] {
        return arr.sort((a, b) => {
            if (a.freq > b.freq) {
                return 1;
            } else if (a.freq < b.freq) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    public PrintNode(node?: INode): void {
        node = node == undefined ? this.rootNode : node;
        if (!node) return;

        const printStack: Stack<INode | ILeafNode | undefined> = new Stack<INode | ILeafNode | undefined>();
        printStack.push(node);

        for (let i = 0; printStack.length() != 0; i++) {
            const element = printStack.pop();
            if (element == undefined) continue;

            if (isInstanceOfLeafNode(element)) {
                console.log("ILeafNode ", element.key, "freq ", element.freq);
                continue;

            }
            const left: INode = element.left as INode;
            const right: INode = element.right as INode;

            printStack.push(left);
            printStack.push(right);


        }
    }

    // return string with out repeating chars
    public getPureString(leafs: ILeafNode[]): string {

        let str = "";
        leafs.forEach(element => {
            str += element.key;
        });
        return str;
    }
}
