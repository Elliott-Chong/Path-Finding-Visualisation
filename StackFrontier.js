class StackFrontier extends QueueFrontier {
    constructor() {
        super()
    }
    remove() {
        return this.frontier.pop()
    }
}