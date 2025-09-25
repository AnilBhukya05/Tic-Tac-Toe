
let boxes = document.querySelectorAll(".box");
let turn0 = false;           // false = human(X), true = system(O)

const winPatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

let winnerPopup = document.getElementById("winner-popup");
let winnerText = document.getElementById("winner-text");
let newGameBtn = document.getElementById("new-game");

// Human click
boxes.forEach((box)=> {
    box.addEventListener("click", () => {
        if (!turn0 && box.innerText === "") { 
            box.innerHTML = "X";
            box.disabled = true;
            checkWinner();

            if (!winnerPopup.classList.contains("hidden")) return;
            turn0 = true;
            setTimeout(systemMove, 500);            // system plays after delay
        }
    });
});

// System move (medium-difficulty)
function systemMove() {
    let move = findBestMove("O"); 
    if (move === null) move = findBestMove("X");    // block player
    if (move === null) {
        // random move
        let emptyBoxes = Array.from(boxes).filter(b => b.innerText === "");
        move = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    }

    if (move) {
        move.innerHTML = "O";
        move.disabled = true;
        checkWinner();
    }
    turn0 = false;
}


function findBestMove(symbol) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        let vals = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
        if (vals.filter(v => v === symbol).length === 2 && vals.includes("")) {
            let emptyIndex = pattern[vals.indexOf("")];
            return boxes[emptyIndex];
        }
    }
    return null;
}

const checkWinner = () => {
    let winnerFound = false;

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        let pos1val = boxes[a].innerText;
        let pos2val = boxes[b].innerText;
        let pos3val = boxes[c].innerText;

        if(pos1val !== "" && pos1val === pos2val && pos2val === pos3val) {
            winnerFound = true;
            showWinner(pos1val, pattern);
            break;
        }
    }

    if (!winnerFound) {
        const allFilled = Array.from(boxes).every(b => b.innerText !== "");
        if (allFilled) {
            showDraw();
        }
    }
}

function showWinner(winner, pattern) {
    pattern.forEach(i => boxes[i].classList.add("win")); 
    winnerText.innerText = `Congratulations ${winner}, You Won!`;
    winnerPopup.classList.remove("hidden");
    disableBoxes();
}

function showDraw() {
    winnerText.innerText = "It's a Draw!";
    winnerPopup.classList.remove("hidden");
    disableBoxes();
}

function disableBoxes() {
    boxes.forEach(box => box.disabled = true);
}

function resetBoard() {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("win");
    });
    winnerText.innerText = "";
    turn0 = false;          // human starts again
}

newGameBtn.addEventListener("click", () => {
    winnerPopup.classList.add("hidden");
    resetBoard();
});


