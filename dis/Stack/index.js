"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stack {
    constructor() {
        this.items = [];
    }
    push(element) {
        // console.log("[+] element push\n ", element);
        this.items.push(element);
    }
    pop() {
        if (this.items.length === 0) {
            return undefined;
        }
        let element = this.items.pop();
        // console.log("[+] element pop\n ", element);
        return element;
    }
    peek() {
        if (this.items.length === 0) {
            return undefined;
        }
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
    clear() {
        this.items = [];
    }
    length() {
        return this.items.length;
    }
    print() {
        console.log(this.items.toString());
    }
    toString() {
        return this.items.toString();
    }
}
exports.default = Stack;
