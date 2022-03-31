class QueueFrontier {
    constructor() {
        // console.log('constructing new frontier')
        this.frontier = []
    }

    isEmpty() {
        return this.frontier.length === 0
    }

    add(grid) {
        this.frontier.push(grid)
    }

    remove() {
        return this.frontier.shift()
    }

    contains(grid) {
        return this.frontier.some(elt => {
            elt.i == grid.i && elt.j == grid.j
        })
    }
}


class StackFrontier extends QueueFrontier {
    constructor() {
        super()
    }
    remove() {
        return this.frontier.pop()
    }
}