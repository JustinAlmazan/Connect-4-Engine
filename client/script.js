// Game information
var board;
let notation;
let turns = 0;

let game = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];

// Column buttons
let columns = [null, null, null, null, null, null, null];
const col = [];
col[0] = null;

// Load game
window.onload = function()
{
    gameSetup();
}

function gameSetup()
{
    // Create board layout
    board = [];
    notation = "";

    for (let r = 1; r <= 6; r++)
    {
        let row = [];
    
        for (let c = 1; c <= 7; c++)
        {
            row.push(' ');

            let circle = document.createElement("div");
            circle.id = r.toString() + "-" + c.toString();
            circle.classList.add("circle");
            document.getElementById("board").append(circle);
        }

        board.push(row);

        for (let i = 1; i <= 7; i++)
        {
            let ID = "btn-" + i.toString();
            col[i] = document.getElementById(ID);
        }
    }

    let columns = [];

    // Create spaces for player chips
    for (let i = 1; i <= 7; i++)
    {

        let button = document.createElement("button");
        let left = 78 * (i - 1)+16;
        button.id = "btn-" + i.toString();
        button.style.left = left.toString() + "px";
        button.classList.add("col-select");
        document.getElementById("col-buttons").append(button);
        button.addEventListener('click', () => turn(i));
        button.disabled = false;
        
        columns[i-1] = (button);
    }

    document.getElementById("undo").addEventListener('click', () => undoMove());
    document.getElementById("reset").addEventListener('click', () => resetBoard());
}

function turn(col)
{
    notation += col.toString();
    let row = placeChip(col, turns % 2);
    if (row == -1) return;

    checkWin(row, col - 1, (turns % 2) + 1);
    turns++;
}

function placeChip(x, color)
{
    let h = 6;
    while (h > 0 && game[h-1][x-1] != 0) h--;

    if (h < 1) return -1; // Column is full

    let ID = h.toString() + "-" + x.toString();

    let piece = document.getElementById(ID);
    piece.style.backgroundColor = ((color == 0) ? "red" : "yellow");
    game[h-1][x-1] = color + 1;

    return h - 1;
}

function checkWin(r0, c0, color)
{
    // Call helper functions
    let h = horizontal(r0, c0, color);
    let v = vertical(r0, c0, color);
    let p = posDiag(r0, c0, color);
    let n = negDiag(r0, c0, color);

    if (h || v || p || n)
    {
        endGame();
    }
}

function horizontal(r0, c0, color)
{
    let res = 1;

    let c = c0 - 1;
    let r = r0;

    while (inBounds(r, c) && game[r][c] == color)
    {
        res++;
        c--;
    }

    c = c0 + 1;

    while (inBounds(r, c) && game[r][c] == color)
    {
        res++;
        c++;
    }

    return ((res >= 4) ? true : false);
}

function vertical(r0, c0, color)
{
    let res = 1;

    let c = c0;
    let r = r0 - 1;

    while (inBounds(r, c) && game[r][c] == color)
    {
        res++;
        r--;
    }

    r = r0 + 1;

    while (inBounds(r, c) && game[r][c] == color)
    {
        res++;
        r++;
    }

    return ((res >= 4) ? true : false);
}

function posDiag(r0, c0, color)
{
    let res = 1;

    let c = c0 - 1;
    let r = r0 + 1;

    while (inBounds(r, c) && game[r][c] == color)
    {
        res++;
        c--;
        r++;
    }

    c = c0 + 1;
    r = r0 - 1;

    while (inBounds(r, c) && game[r][c] == color)
    {
        res++;
        c++;
        r--;
    }

    return ((res >= 4) ? true : false);
}

function negDiag(r0, c0, color)
{
    let res = 1;

    let c = c0 - 1;
    let r = r0 - 1;

    while (inBounds(r, c) && game[r][c] == color)
    {
        res++;
        c--;
        r--;
    }

    c = c0 + 1;
    r = r0 + 1;

    while (inBounds(r, c) && game[r][c] == color)
    {
        res++;
        c++;
        r++;
    }

    return ((res >= 4) ? true : false);
}

function undoMove()
{
    // No moves to undo
    if (notation == "")
    {
        return;
    }

    let n = notation.length;
    let c = parseInt(notation.substring(n-1, n));

    // Get most recent chip placed in column
    let r = 0;

    while (r < 6 && game[r][c-1] == 0)
    {
        r++;
    }

    if (r >= 6) return; // OOB

    // Undo values
    game[r][c-1] = 0;

    let piece = document.getElementById((r+1).toString() + "-" + (c).toString());
    piece.style.backgroundColor = "white";

    notation = notation.substring(0, n-1);
}

function resetBoard()
{
    for (let i = 0; i < 6; i++)
    {
        for (let j = 0; j < 7; j++)
        {
            game[i][j] = 0;
            let piece = document.getElementById((i+1).toString() + "-" + (j+1).toString());
            piece.style.backgroundColor = "white";
        }
    }

    notation = "";
}

function inBounds(r, c)
{
    return (0 <= r && r <= 5 && 0 <= c && c <= 6) ? true : false;
}

function endGame()
{
    alert("Game over");
}

