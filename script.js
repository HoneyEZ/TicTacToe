const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board;
let ai = "O";
let human = "X";
let currentPlayer = human;
let boardEmpty = true;
let firstMoveCheck = true;
let board_full = false;

const squares = Array.from(document.querySelectorAll("#board div"));

document.getElementById("board").addEventListener("click", mousePressed);
const messages = document.querySelector("h2");
document.getElementById("reset-button").addEventListener("click", init);

document.getElementById("x").addEventListener("click", selectX);
document.getElementById("o").addEventListener("click", selectO);

function selectX() {
  if (firstMoveCheck && boardEmpty) {
    human = "X";
    currentPlayer = human;
    ai = "O";
    firstMoveCheck = false;
    draw();
  }
}

function selectO() {
  if (firstMoveCheck && boardEmpty) {
    human = "O";
    currentPlayer = human;
    ai = "X";
    firstMoveCheck = false;
    bestMove();
    draw();
  }
}

function mousePressed() {
  boardEmpty = false;
  firstMoveCheck = false;
  if (currentPlayer == human && board_full == false) {
    let selected = squares.findIndex(function (square) {
      return square === event.target;
    });
    if (board[selected] == "") {
      board[selected] = human;
      currentPlayer = ai;
      bestMove();
      draw();
    }
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  board[move] = ai;
  currentPlayer = human;
}

function checkWinner() {
  let winner = null;
  winningCombos.forEach((combo, index) => {
    if (
      board[combo[0]] &&
      board[combo[0]] === board[combo[1]] &&
      board[combo[0]] === board[combo[2]]
    ) {
      winner = board[combo[0]];
    }
  });

  let openSpots = 0;
  for (let i = 0; i < 9; i++) {
    if (board[i] == "") {
      openSpots++;
    }
  }

  if (winner == null && openSpots == 0) {
    return "tie";
  } else {
    return winner;
  }
}

let scoresO = {
  X: -10,
  O: 10,
  tie: 0,
};

let scoresX = {
  X: 10,
  O: -10,
  tie: 0,
};

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) {
    if (ai == "O") {
      return scoresO[result];
    } else {
      return scoresX[result];
    }
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] == "") {
        board[i] = ai;
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] == "") {
        board[i] = human;
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function draw() {
  board.forEach(function (mark, index) {
    squares[index].textContent = mark;
  });

  let win = checkWinner();
  console.log(firstMoveCheck);
  if (firstMoveCheck != true) {
    messages.textContent =
      win === "tie"
        ? `Это ничья!`
        : win
        ? `${win} выиграли игру!`
        : `${currentPlayer} ваш ход!`;
  } else {
    messages.textContent = "Выберите сторону";
  }
  if (win) board_full = true;
}

function init() {
  board = ["", "", "", "", "", "", "", "", ""];
  boardEmpty = true;
  board_full = false;

  firstMoveCheck = true;
  win = null;
  ai = "O";
  human = "X";
  currentPlayer = human;

  draw();
}

init();
