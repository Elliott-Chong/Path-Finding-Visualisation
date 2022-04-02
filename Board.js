class Board {
    constructor(ROWS = 20, COLS = 20) {
        // console.log('constructing new board')
        this.board = new Array(ROWS)
        this.startingIndex = localStorage.getItem('startingIndex') ? JSON.parse(localStorage.getItem('startingIndex')) : { i: 1, j: 1 }
        this.endingIndex = localStorage.getItem('endingIndex') ? JSON.parse(localStorage.getItem('endingIndex')) : { i: ROWS - 2, j: COLS - 2 }
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

    isValidIndexA(i, j) {
        return i >= 0 && i < ROWS && j >= 0 && j < COLS && this.board[i][j].isWall && !this.board[i][j].isStart && !this.board[i][j].isEnd
    }
    isValidIndexB(i, j) {
        return i >= 0 && i < ROWS && j >= 0 && j < COLS && !this.board[i][j].isWall && !this.board[i][j].isStart && !this.board[i][j].isEnd
    }

    getFrontier(grid) {
        let frontiers = []
        let topIndex = { i: grid.i - 2, j: grid.j }
        let rightIndex = { i: grid.i, j: grid.j + 2 }
        let bottomIndex = { i: grid.i + 2, j: grid.j }
        let leftIndex = { i: grid.i, j: grid.j - 2 }
        if (this.isValidIndexA(topIndex.i, topIndex.j)) frontiers.push(this.board[topIndex.i][topIndex.j])
        if (this.isValidIndexA(rightIndex.i, rightIndex.j)) frontiers.push(this.board[rightIndex.i][rightIndex.j])
        if (this.isValidIndexA(bottomIndex.i, bottomIndex.j)) frontiers.push(this.board[bottomIndex.i][bottomIndex.j])
        if (this.isValidIndexA(leftIndex.i, leftIndex.j)) frontiers.push(this.board[leftIndex.i][leftIndex.j])
        return frontiers
    }

    getFrontierNeighbour(frontier) {
        let neigbours = []
        let topIndex = { i: frontier.i - 2, j: frontier.j }
        let rightIndex = { i: frontier.i, j: frontier.j + 2 }
        let bottomIndex = { i: frontier.i + 2, j: frontier.j }
        let leftIndex = { i: frontier.i, j: frontier.j - 2 }
        if (this.isValidIndexB(topIndex.i, topIndex.j)) neigbours.push(this.board[topIndex.i][topIndex.j])
        if (this.isValidIndexB(rightIndex.i, rightIndex.j)) neigbours.push(this.board[rightIndex.i][rightIndex.j])
        if (this.isValidIndexB(bottomIndex.i, bottomIndex.j)) neigbours.push(this.board[bottomIndex.i][bottomIndex.j])
        if (this.isValidIndexB(leftIndex.i, leftIndex.j)) neigbours.push(this.board[leftIndex.i][leftIndex.j])
        return neigbours
    }


    async generateRandomMaze() {
        visualising = true
        let allFrontiers = []
        this.board = new Array(ROWS)
        for (let i = 0; i < ROWS; i++) {
            this.board[i] = new Array(COLS)
        }
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                this.board[i][j] = new Grid(i, j, (i == this.startingIndex.i && j == this.startingIndex.j), (i == this.endingIndex.i && j == this.endingIndex.j))
                this.board[i][j].isWall = true
                if (i == this.startingIndex.i && j == this.startingIndex.j) {
                    this.start = this.board[i][j]
                    this.board[i][j].isWall = false
                }
                if (i == this.endingIndex.i && j == this.endingIndex.j) {
                    this.end = this.board[i][j]
                    this.board[i][j].isWall = false
                }
            }
        }
        let initialGrid = this.board[floor(random(0, ROWS))][floor(random(0, COLS))]
        initialGrid.isWall = false
        allFrontiers.push(...this.getFrontier(initialGrid))
        while (allFrontiers.length > 0) {
            if (wallAnimation) {
                await sleep(1)
            }

            let currentFrontier = allFrontiers[floor(random(0, allFrontiers.length))]
            let neigbours = this.getFrontierNeighbour(currentFrontier)
            if (neigbours.length > 0) {
                let currentPath = neigbours[floor(random(0, neigbours.length))]
                if (currentFrontier.i !== currentPath.i) {
                    let carve = this.board[(currentFrontier.i + currentPath.i) / 2][currentFrontier.j]
                    carve.isWall = false
                    currentFrontier.isWall = false
                    for (let frontier of this.getFrontier(currentFrontier)) {
                        arrAdd(allFrontiers, frontier)
                    }
                }
                else if (currentFrontier.j !== currentPath.j) {
                    let carve = this.board[currentFrontier.i][(currentFrontier.j + currentPath.j) / 2]
                    carve.isWall = false
                    currentFrontier.isWall = false
                    for (let frontier of this.getFrontier(currentFrontier)) {
                        arrAdd(allFrontiers, frontier)
                    }
                }
                arrRemove(allFrontiers, currentFrontier)
            }
        }

        let startStuck = true
        let neigbours = this.getNeighbours(this.start)
        for (let neigbour of neigbours) {
            if (!neigbour.isWall) startStuck = false
        }
        if (startStuck) {
            let numberToCarve = floor(random(1, 5))
            for (let i = 0; i < numberToCarve; i++) {
                let temp = neigbours[floor(random(0, neigbours.length))]
                while (!temp.isWall) {
                    temp = neigbours[floor(random(0, neigbours.length))]
                }
                temp.isWall = false
            }
        }

        let endStuck = true
        neigbours = this.getNeighbours(this.end)
        for (let neigbour of neigbours) {
            if (!neigbour.isWall) endStuck = false
        }
        if (endStuck) {
            let numberToCarve = floor(random(1, 5))
            for (let i = 0; i < numberToCarve; i++) {
                let temp = neigbours[floor(random(0, neigbours.length))]
                while (!temp.isWall) {
                    temp = neigbours[floor(random(0, neigbours.length))]
                }
                temp.isWall = false
            }
        }
        visualising = false
        ai = new AI(this)
    }


    getNeighbours(grid) {
        let neigbours = []
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy == 0 && dx == 0) continue
                if (dy == 1 && dx == 1) continue
                if (dy == -1 && dx == -1) continue
                if (dy == 1 && dx == -1) continue
                if (dy == -1 && dx == 1) continue

                let newi = grid.i + dy
                let newj = grid.j + dx
                if (newi >= 0 && newi < ROWS && newj >= 0 && newj < COLS) {
                    neigbours.push(this.board[newi][newj])
                }
            }
        }

        return neigbours
    }

    rerender() {

        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {

                if (this.board[i][j].isStart) {
                    this.board[i][j] = new Grid(i, j, (i == this.startingIndex.i && j == this.startingIndex.j), (i == this.endingIndex.i && j == this.endingIndex.j))
                }
                else if (this.board[i][j].isEnd) {
                    this.board[i][j] = new Grid(i, j, (i == this.startingIndex.i && j == this.startingIndex.j), (i == this.endingIndex.i && j == this.endingIndex.j))
                }

                if (i == this.startingIndex.i && j == this.startingIndex.j) {
                    this.board[i][j] = new Grid(i, j, (i == this.startingIndex.i && j == this.startingIndex.j), (i == this.endingIndex.i && j == this.endingIndex.j))
                    this.start = this.board[i][j]
                }
                if (i == this.endingIndex.i && j == this.endingIndex.j) {
                    this.board[i][j] = new Grid(i, j, (i == this.startingIndex.i && j == this.startingIndex.j), (i == this.endingIndex.i && j == this.endingIndex.j))
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
        let wo = new Date()
        finalPathCountP.elt.innerText = 'Final path count: ' + path.length
        console.log('real time elapsed: ', wo - now)
        clearInterval(timeInterval)
        for (let grid of path) {
            this.board[grid.i][grid.j].isPath = true
            await sleep(10)
        }
        visualising = false
    }
}