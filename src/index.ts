import Huffman from "./Huffman";



const str: string = "kolo";

const compreser: Huffman = new Huffman(str);

const compressed: string = compreser.compress();

console.log("str ", str);
console.log("compressed ", compressed);

const decompresed: string = compreser.deCompress(compressed);
console.log("decompresed ", decompresed);



// console.log(GetStringFromHuffmanCode(code, GenerateHuffmanTree(GetLeafNodesFromString(str))) === str);



