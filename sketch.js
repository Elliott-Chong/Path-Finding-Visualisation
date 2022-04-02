let ROWS = 35
let COLS = 30
let LENGTH;
let BoardObj
let ai
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))
let sel
let wallAnimation = true
let mazeSel
let visualising = false
let removingWall = false
let algorithm = localStorage.getItem('algorithm')

let movingStart = false
let movingEnd = false

let startTime = 0;
let endTime = 0;
let timeInterval;
let now
let exploredNumberP
let timeP
let finalPathCountP
let desc3
let heading3





function setup() {
    createCanvas(window.innerWidth * 0.7, window.innerHeight * 0.9);
    LENGTH = height / ROWS
    COLS = round(width / LENGTH)

    BoardObj = new Board(ROWS, COLS)
    ai = new AI(BoardObj)
    // creating the elements
    let sideDiv = createDiv()
    let phoneDiv = createDiv('It seems you are using a phone, for the best experience, please view this website on a laptop/desktop.')
    let btnContainer = createDiv()
    let wallsContainer = createDiv()
    let removeWallbtn = createButton('Remove walls')
    let infoDiv = createDiv()
    let startBtn = createButton('Visualise')
    let resetBtn = createButton('Reset')
    let wallAnimationbtn = createButton('Toggle wall animation')
    let genMazeBtn = createButton('Generate random maze')
    let desc1 = createP('<u>Drag to place walls.</u>')
    let desc2 = createP('To change the locations of the start and end points, simply click on one of them first, then move it to another cell.')
    desc3 = createP("This algorithm explores all nodes at the present depth prior to moving on to the nodes at the next depth level. <br/><br/>Gurantees shortest path.<br/>")
    let metaDiv = createDiv()
    let credits = createP("Source Code: <a href='https://github.com/Elliott-Chong/Path-Finding-Visualisation' target='_blank'>Elliott Chong</a>")
    credits.elt.style.fontWeight = '600'
    credits.elt.style.fontSize = '1.25rem'
    heading3 = createP('Breadth First Search:')
    exploredNumberP = createP('Explored grids: 0')
    timeP = createP('Time elapsed: 0s')
    finalPathCountP = createP('Final path count: 0')

    // algorithm selection
    sel = createSelect()
    sel.option('Breadth First Search')
    sel.option('Depth First Search')
    sel.option('A* Search')
    sel.option('Greedy Best First Search')
    if (algorithm) {
        sel.selected(algorithm)
        changeAlgorithm()
    }
    sel.changed(changeAlgorithm)

    // maze selection


    // setting id for btnContainer and sideDiv
    btnContainer.elt.setAttribute('id', 'btnContainer')
    sideDiv.elt.setAttribute('id', 'sideDiv')
    infoDiv.elt.setAttribute('id', 'infoDiv')
    metaDiv.elt.setAttribute('id', 'metaDiv')
    wallsContainer.elt.setAttribute('id', 'wallsContainer')
    heading3.elt.classList.add('heading3')
    phoneDiv.elt.setAttribute('id', 'phoneDiv')
    wallAnimationbtn.elt.classList.add('wallAnimation')

    // appending all the children and stuff
    wallsContainer.elt.appendChild(removeWallbtn.elt)
    wallsContainer.elt.appendChild(wallAnimationbtn.elt)
    metaDiv.elt.appendChild(exploredNumberP.elt)
    metaDiv.elt.appendChild(timeP.elt)
    metaDiv.elt.appendChild(finalPathCountP.elt)
    btnContainer.elt.appendChild(wallsContainer.elt)
    btnContainer.elt.appendChild(startBtn.elt)
    btnContainer.elt.appendChild(resetBtn.elt)
    btnContainer.elt.appendChild(genMazeBtn.elt)
    btnContainer.elt.appendChild(sel.elt)
    infoDiv.elt.appendChild(desc1.elt)
    infoDiv.elt.appendChild(desc2.elt)
    infoDiv.elt.appendChild(heading3.elt)
    infoDiv.elt.appendChild(desc3.elt)
    sideDiv.elt.appendChild(metaDiv.elt)
    sideDiv.elt.appendChild(btnContainer.elt)
    sideDiv.elt.appendChild(infoDiv.elt)
    sideDiv.elt.appendChild(infoDiv.elt)
    sideDiv.elt.appendChild(credits.elt)

    // attatch onClick listeners
    startBtn.mousePressed(init)
    resetBtn.mousePressed(reset)
    removeWallbtn.mousePressed(() => {
        removeWallbtn.elt.classList.toggle('removeWall')
        removingWall = !removingWall
    })
    genMazeBtn.mousePressed(generateMaze)
    wallAnimationbtn.mousePressed(() => {
        wallAnimationbtn.elt.classList.toggle('wallAnimation')
        wallAnimation = !wallAnimation
    })
}

const generateMaze = () => {
    if (visualising) return
    BoardObj.generateRandomMaze()
}


const changeAlgorithm = () => {
    algorithm = sel.value()
    localStorage.setItem('algorithm', algorithm)
    if (algorithm === 'Breadth First Search') {
        heading3.elt.innerText = 'Breadth First Search:'
        desc3.elt.innerHTML = 'This algorithm explores all nodes at the present depth prior to moving on to the nodes at the next depth level. It is an uninformed search algorithm. <br/><br/>Gurantees shortest path.<br/><br/>'
    }
    else if (algorithm === 'Depth First Search') {
        heading3.elt.innerText = 'Depth First Search:'
        desc3.elt.innerHTML = 'This algorithm starts at the root node and explores as far as possible along each branch before backtracking. It is an uninformed search algorithm <br/><br/>Does not gurantee shortest path<br/><br/>'
    }
    else if (algorithm === 'A* Search') {
        heading3.elt.innerText = 'A* Search:'
        desc3.elt.innerHTML = 'This algorithm is the most optimal in terms of time efficiency. It is an informed search algorithm that utilises 2 heuristics to find the shortest path. <br/><br/>Gurantees shortest path.<br/><br/>'
    }
    else if (algorithm === 'Greedy Best First Search') {
        heading3.elt.innerText = 'Greedy Best First Search:'
        desc3.elt.innerHTML = 'This algorithm is an informed search algorithm that only utilises one heuristic function that always chooses the path which appear best at the moment. <br/><br/>Does not gurantee shortest path.<br/><br/>'
    }
}

function mousePressed() {
    if (visualising) return
    let y, x
    y = Math.floor(map(mouseY, 0, height, 0, ROWS))
    x = Math.floor(map(mouseX, 0, width, 0, COLS))
    if (y >= ROWS || y < 0 || x >= COLS || x < 0) return
    if (BoardObj.board[y][x].isStart) {
        if (movingStart) {
            movingStart = false
        } else {
            movingStart = true
            movingEnd = false
        }
    }
    else if (BoardObj.board[y][x].isEnd) {
        if (movingEnd) {
            movingEnd = false
        } else {
            movingEnd = true
            movingStart = false
        }
    }
    else if (movingStart) {
        BoardObj.startingIndex = { i: y, j: x }
        localStorage.setItem('startingIndex', JSON.stringify({ i: y, j: x }))
        BoardObj.rerender()
        movingEnd = false
        movingStart = false
    }
    else if (movingEnd) {
        localStorage.setItem('endingIndex', JSON.stringify({ i: y, j: x }))
        BoardObj.endingIndex = { i: y, j: x }
        BoardObj.rerender()
        movingEnd = false
        movingStart = false
    }
}

const reset = () => {
    clearInterval(timeInterval)
    exploredNumberP.elt.innerText = 'Explored grids: 0'
    timeP.elt.innerText = 'Time elapsed: 0s'
    finalPathCountP.elt.innerText = 'Final path count: 0'
    BoardObj = new Board(ROWS, COLS)
    ai = new AI(BoardObj, algorithm)
    visualising = false
}

const init = () => {
    if (visualising) return
    visualising = true
    ai.start(algorithm)
}


const makeWall = (y, x) => {
    if (visualising) return
    if (y >= ROWS || y < 0 || x >= COLS || x < 0) return
    if (!BoardObj.board[y][x].isWall && !removingWall && ((y != BoardObj.start.i || x != BoardObj.start.j) && (y != BoardObj.end.i || x != BoardObj.end.j))) {
        BoardObj.board[y][x].isWall = true
    }
    if (BoardObj.board[y][x].isWall && removingWall && ((y != BoardObj.start.i || x != BoardObj.start.j) && (y != BoardObj.end.i || x != BoardObj.end.j))) {
        BoardObj.board[y][x].isWall = false
    }
    // else if (BoardObj.board[y][x].isWall && ((y != BoardObj.start.i && x != BoardObj.start.j) || (y != BoardObj.end.i && x != BoardObj.end.j))) {
    //     BoardObj.board[y][x].isWall = false
    // }
}

// const changeStart = (y, x) => {
//     BoardObj.startingIndex = { i: y, j: x }
//     BoardObj.rerender()
// }





async function draw() {
    background(255)

    if (mouseIsPressed) {
        let y, x
        y = Math.floor(map(mouseY, 0, height, 0, ROWS))
        x = Math.floor(map(mouseX, 0, width, 0, COLS))
        makeWall(y, x)
    }
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            BoardObj.board[i][j].show()
        }
    }
}
