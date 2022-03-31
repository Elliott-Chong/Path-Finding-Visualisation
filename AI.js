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
        this.algorithm = algorithm
        if (this.algorithm === 'Breadth First Search') {
            this.frontier = new QueueFrontier()
        }
        else if (this.algorithm === 'Depth First Search') {
            this.frontier = new StackFrontier()
        }
        this.seen = []
        this.BoardObj.reset()
        this.frontier.add(this.BoardObj.start)
        let currentGrid;
        while (!this.frontier.isEmpty()) {
            currentGrid = this.frontier.remove()
            if (arrContains(this.seen, currentGrid)) {
                continue
            }
            currentGrid.isExplored = true
            arrAdd(this.seen, currentGrid)
            if (currentGrid.isEnd) {
                let path = [currentGrid]
                while (!compareGrids(currentGrid, this.BoardObj.start)) {
                    path.push(currentGrid.parent)
                    currentGrid = currentGrid.parent
                }
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
            visualising = false
        }

    }
    // for (let neigbour of this.getNeighbours(currentGrid)) {
    //     if (arrContains(this.seen, neigbour)) continue
    //     await sleep(5)
    //     neigbour.isExplored = true
    //     neigbour.parent = currentGrid
    //     if (neigbour.isEnd) {
    //         let path = [neigbour]
    //         while (!compareGrids(neigbour, this.BoardObj.start)) {
    //             path.push(neigbour.parent)
    //             neigbour = neigbour.parent
    //         }
    //         console.log(path)
    //         this.BoardObj.found(path)
    //         return
    //     }
    //     this.frontier.add(neigbour)
    // }

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