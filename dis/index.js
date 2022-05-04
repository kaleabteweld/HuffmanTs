"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Huffman_1 = __importDefault(require("./Huffman"));
const str = "kolo";
const compreser = new Huffman_1.default(str);
const compressed = compreser.compress();
console.log("str ", str);
console.log("compressed ", compressed);
const decompresed = compreser.deCompress(compressed);
console.log("decompresed ", decompresed);
// console.log(GetStringFromHuffmanCode(code, GenerateHuffmanTree(GetLeafNodesFromString(str))) === str);
