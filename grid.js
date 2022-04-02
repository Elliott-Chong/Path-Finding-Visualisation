class Grid {
    constructor(i, j, isStart = false, isEnd = false, isWall = false) {
        this.i = i
        this.j = j
        this.isWall = isWall
        this.isPath = false
        this.isExplored = false
        this.isStart = isStart
        this.parent = null
        this.isFrontier = false
        this.isEnd = isEnd
        this.g = null
        this.h = null
        this.f = null
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
        if (movingStart && this.isStart) {
            fill('rgba(0,0,255,0.5)')
        }
        if (movingEnd && this.isEnd) {
            fill('rgba(255,0,0,0.5)')
        }
        if (this.isFrontier) {
            fill(0, 255, 0)
        }
        rect(this.j * LENGTH, this.i * LENGTH, LENGTH - 1, LENGTH - 1)
    }
}