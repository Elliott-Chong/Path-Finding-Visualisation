class Grid {
    constructor(i, j, isStart = false, isEnd = false, isWall = false) {
        this.i = i
        this.j = j
        this.isWall = isWall
        this.isPath = false
        this.isExplored = false
        this.isStart = isStart
        this.parent = null
        this.isEnd = isEnd
    }

    show() {
        fill(255)
        stroke(0)
        strokeWeight(1)
        if (this.isWall) {
            fill(0, 0, 0)
        }
        else if (this.isStart) {
            fill(0, 0, 255)
        }
        else if (this.isEnd) {
            fill(255, 0, 0)
        }
        else if (this.isPath) {
            fill(0, 255, 0)
        }
        else if (this.isExplored && !this.isStart && !this.isEnd && !this.isPath) {
            fill(150)
        }
        rect(this.j * LENGTH, this.i * LENGTH, LENGTH, LENGTH)
    }
}