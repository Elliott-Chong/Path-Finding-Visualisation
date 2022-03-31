const ROWS = 25
const COLS = 25
let LENGTH;
let BoardObj
let ai
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))
let sel
let visualising = false
let algorithm = 'Breadth First Search'
movingStart = false
movingEnd = false
let startSvg


function setup() {
    createCanvas(700, 700);
    LENGTH = width / ROWS
    BoardObj = new Board(ROWS, COLS)
    ai = new AI(BoardObj)
    // creating the elements
    let sideDiv = createDiv()
    let btnContainer = createDiv()
    let infoDiv = createDiv()
    let startBtn = createButton('Visualise')
    let resetBtn = createButton('Reset')
    let desc1 = createP('Drag to place walls, pretty self explanatory init?')
    let desc2 = createP('To change the locations of the start and end points, simply click on one of them first, then move it to another cell.')

    // algorithm selection
    sel = createSelect()
    sel.option('Breadth First Search')
    sel.option('Depth First Search')
    sel.changed(changeAlgorithm)

    // setting id for btnContainer and sideDiv
    btnContainer.elt.setAttribute('id', 'btnContainer')
    sideDiv.elt.setAttribute('id', 'sideDiv')
    infoDiv.elt.setAttribute('id', 'infoDiv')

    // appending all the children and stuff
    btnContainer.elt.appendChild(startBtn.elt)
    btnContainer.elt.appendChild(resetBtn.elt)
    btnContainer.elt.appendChild(sel.elt)
    infoDiv.elt.appendChild(desc1.elt)
    infoDiv.elt.appendChild(desc2.elt)
    sideDiv.elt.appendChild(btnContainer.elt)
    sideDiv.elt.appendChild(infoDiv.elt)
    sideDiv.elt.appendChild(infoDiv.elt)

    // attatch onClick listeners
    startBtn.mousePressed(init)
    resetBtn.mousePressed(reset)
}

const changeAlgorithm = () => {
    algorithm = sel.value()
}

function mousePressed() {
    if (visualising) return
    let y, x
    y = Math.floor(map(mouseY, 0, width, 0, ROWS))
    x = Math.floor(map(mouseX, 0, height, 0, COLS))
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
        BoardObj.rerender()
        movingEnd = false
        movingStart = false
    }
    else if (movingEnd) {
        BoardObj.endingIndex = { i: y, j: x }
        BoardObj.rerender()
        movingEnd = false
        movingStart = false
    }
}

const reset = () => {
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
    if (!BoardObj.board[y][x].isWall && ((y != BoardObj.start.i || x != BoardObj.start.j) && (y != BoardObj.end.i || x != BoardObj.end.j))) {
        BoardObj.board[y][x].isWall = true
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
        y = Math.floor(map(mouseY, 0, width, 0, ROWS))
        x = Math.floor(map(mouseX, 0, height, 0, COLS))
        makeWall(y, x)
    }
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            BoardObj.board[i][j].show()
        }
    }
}
