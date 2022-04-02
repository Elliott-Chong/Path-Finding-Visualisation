const arrContains = (arr, elt) => {
    for (let yes of arr) {
        if (JSON.stringify(yes.i) === JSON.stringify(elt.i) && JSON.stringify(yes.j) === JSON.stringify(elt.j)) {
            return true;
        }
    }
    return false;
};


//write a function to compare two arrays
function compareArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
            return false;
        }
    }
    return true;
}


const arrRemove = (arr, elt) => {
    for (let i = 0; i < arr.length; i++) {
        if (JSON.stringify(arr[i]) === JSON.stringify(elt)) {
            arr.splice(i, 1);
        }
    }
};

const arrAdd = (arr, elt) => {
    for (let i = 0; i < arr.length; i++) {
        if (JSON.stringify(arr[i].i) === JSON.stringify(elt.i) && JSON.stringify(arr[i].j) === JSON.stringify(elt.j)) {
            return;
        }
    }
    arr.unshift(elt);
};

const compareGrids = (grid1, grid2) => {
    return grid1.i === grid2.i && grid1.j === grid2.j
}


class AI {
    constructor(board, algorithm) {
        // console.log('constructing new AI')
        this.BoardObj = board
        this.board = this.BoardObj.board
        this.frontier = new QueueFrontier()
        this.seen = []
        this.algorithm = algorithm
    }

    async start(algorithm) {
        now = new Date()
        startTime = 0
        this.algorithm = algorithm
        let exploredNum = 0
        finalPathCountP.elt.innerText = 'Final path count: 0'
        timeP.elt.innerText = 'Time elapsed: 0s'
        clearInterval(timeInterval)
        timeInterval = setInterval(() => {
            let hi = new Date()
            startTime = hi - now
            if (startTime >= 1000) {
                timeP.elt.innerText = 'Time elapsed: ' + Math.floor(startTime / 1000) + 's ' + startTime % 1000 + 'ms'
            }
            else {
                timeP.elt.innerText = 'Time elapsed: ' + startTime + 'ms'
            }
        }, 1)
        if (this.algorithm === 'Breadth First Search') {
            this.frontier = new QueueFrontier()
        }
        else if (this.algorithm === 'Depth First Search') {
            this.frontier = new StackFrontier()
        }
        else if (this.algorithm === 'A* Search') {
            this.aStar()
            return
        }
        else if (this.algorithm === 'Greedy Best First Search') {
            this.greedy()
            return
        }
        this.seen = []
        this.BoardObj.reset()
        this.frontier.add(this.BoardObj.start)
        let currentGrid;
        while (!this.frontier.isEmpty()) {
            if (!visualising) return
            currentGrid = this.frontier.remove()
            if (arrContains(this.seen, currentGrid)) {
                continue
            }
            currentGrid.isExplored = true
            exploredNum += 1
            exploredNumberP.elt.innerText = 'Explored grids: ' + exploredNum
            arrAdd(this.seen, currentGrid)
            if (currentGrid.isEnd) {
                let path = [currentGrid]
                while (!compareGrids(currentGrid, this.BoardObj.start)) {
                    path.push(currentGrid.parent)
                    currentGrid = currentGrid.parent
                }
                console.log(`path count for ${this.algorithm} is`, path.length)
                this.BoardObj.found(path)
                return
            }
            for (let neigbour of this.getNeighbours(currentGrid)) {
                if (arrContains(this.seen, neigbour)) continue
                neigbour.parent = currentGrid
                this.frontier.add(neigbour)
            }
            await sleep(5)
        }
        if (this.frontier.isEmpty()) {
            console.log("Invalid Maze")
            clearInterval(timeInterval)
            visualising = false
        }

    }

    heuristic = (grid1, endGrid) => {
        return Math.abs(endGrid.i - grid1.i) + Math.abs(endGrid.j - grid1.j)
    }

    lowestFScore = (openSet) => {
        let winner = 0
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i
            }
        }
        return openSet[winner]
    }

    async greedy() {
        let exploredNum = 0
        let openSet = [this.BoardObj.start]
        this.seen = []
        this.BoardObj.reset()
        this.BoardObj.start.f = this.heuristic(this.BoardObj.start, this.BoardObj.end)
        while (openSet.length > 0) {
            if (!visualising) return
            await sleep(5)
            let currentGrid = this.lowestFScore(openSet)

            if (currentGrid.isEnd) {
                //found it
                let path = [currentGrid]
                while (!compareGrids(currentGrid, this.BoardObj.start)) {
                    path.push(currentGrid.parent)
                    currentGrid = currentGrid.parent
                }
                console.log(`path count for Greedy Best First Search is`, path.length)
                this.BoardObj.found(path)
                return
            }
            currentGrid.isExplored = true
            exploredNum += 1
            exploredNumberP.elt.innerText = 'Explored grids: ' + exploredNum
            arrRemove(openSet, currentGrid)
            arrAdd(this.seen, currentGrid)
            for (let neigbour of this.getNeighbours(currentGrid)) {
                if (arrContains(this.seen, neigbour)) continue
                neigbour.f = this.heuristic(neigbour, this.BoardObj.end)
                neigbour.parent = currentGrid
                arrAdd(openSet, neigbour)
            }
        }
        console.log('Invalid maze')
        clearInterval(timeInterval)
        visualising = false
    }

    async aStar() {
        let exploredNum = 0
        let openSet = [this.BoardObj.start]
        this.seen = []
        this.BoardObj.reset()
        this.BoardObj.start.g = 0
        this.BoardObj.start.f = this.heuristic(this.BoardObj.start, this.BoardObj.end)
        while (openSet.length > 0) {
            if (!visualising) return
            await sleep(5)
            let currentGrid = this.lowestFScore(openSet)
            if (currentGrid.isEnd) {
                //found it
                let path = [currentGrid]
                while (!compareGrids(currentGrid, this.BoardObj.start)) {
                    path.push(currentGrid.parent)
                    currentGrid = currentGrid.parent
                }
                console.log("path count for A* is", path.length)
                this.BoardObj.found(path)
                return
            }
            currentGrid.isExplored = true
            exploredNum += 1
            exploredNumberP.elt.innerText = 'Explored grids: ' + exploredNum
            arrRemove(openSet, currentGrid)
            arrAdd(this.seen, currentGrid)
            for (let neigbour of this.getNeighbours(currentGrid)) {
                if (arrContains(this.seen, neigbour)) continue
                let tempG = currentGrid.g + 1
                if (!arrContains(openSet, neigbour)) {
                    neigbour.g = tempG
                    neigbour.f = this.heuristic(neigbour, this.BoardObj.end) + neigbour.g
                    arrAdd(openSet, neigbour)
                    neigbour.parent = currentGrid
                }
                else if (tempG < neigbour.g) {
                    neigbour.g = tempG
                    neigbour.f = this.heuristic(neigbour, this.BoardObj.end) + neigbour.g
                    neigbour.parent = currentGrid
                }

            }
        }
        console.log('Invalid maze')
        clearInterval(timeInterval)
        visualising = false
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
                    if (!this.frontier.contains(this.board[newi][newj]) && !this.board[newi][newj].isWall) {
                        neigbours.push(this.board[newi][newj])
                    }
                }
            }
        }

        return neigbours
    }
}