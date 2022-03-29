class Board {
    constructor(ROWS = 20, COLS = 20) {
        // console.log('constructing new board')
        this.board = new Array(ROWS)
        this.startingIndex = { i: 9, j: 4 }
        this.endingIndex = { i: 9, j: 17 }
        this.start;
        this.end;
        for (let i = 0; i < ROWS; i++) {
            this.board[i] = new Array(COLS)
        }
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                this.board[i][j] = new Grid(i, j, (i == this.startingIndex.i && j == this.startingIndex.j), (i == this.endingIndex.i && j == this.endingIndex.j))
                if (i == this.startingIndex.i && j == this.startingIndex.j) {
                    this.start = this.board[i][j]
                }
                if (i == this.endingIndex.i && j == this.endingIndex.j) {
                    this.end = this.board[i][j]
                }
            }
        }
    }

    reset() {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                this.board[i][j].isExplored = false
                this.board[i][j].isPath = false
            }
        }
    }

    async found(path) {
        for (let grid of path) {
            this.board[grid.i][grid.j].isPath = true
            await sleep(10)
        }
        visualising = false
    }
}