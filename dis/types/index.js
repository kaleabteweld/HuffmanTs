"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeDirType = exports.isInstanceOfNode = exports.isInstanceOfLeafNode = void 0;
function isInstanceOfLeafNode(node) {
    return 'freq' in node;
}
exports.isInstanceOfLeafNode = isInstanceOfLeafNode;
function isInstanceOfNode(node) {
    return 'sun' in node;
}
exports.isInstanceOfNode = isInstanceOfNode;
var NodeDirType;
(function (NodeDirType) {
    NodeDirType[NodeDirType["LEFT"] = 1] = "LEFT";
    NodeDirType[NodeDirType["RIGHT"] = 0] = "RIGHT";
})(NodeDirType = exports.NodeDirType || (exports.NodeDirType = {}));
