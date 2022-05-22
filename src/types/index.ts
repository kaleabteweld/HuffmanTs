export interface ILeafNode {
    key: string;
    freq: number;
}
export interface INode {
    sun: number;
    left?: INode | ILeafNode;
    right?: INode | ILeafNode;
}

export function isInstanceOfLeafNode(node: any): node is ILeafNode {
    return 'freq' in node;
}
export function isInstanceOfNode(node: any): node is INode {
    return 'sun' in node;
}

export enum NodeDirType {
    LEFT = 1,
    RIGHT = 0
}


// string type helper fun
export function reversString(str: string): string {
    return str.split('').reverse().join('');

}