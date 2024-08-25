"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    emails;
    constructor() {
        this.emails = new Set();
    }
    add(emailId) {
        if (this.emails.has(emailId))
            return false;
        this.emails.add(emailId);
        return true;
    }
    remove(emailId) {
        if (this.emails.has(emailId)) {
            this.emails.delete(emailId);
            return true;
        }
        return false;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map