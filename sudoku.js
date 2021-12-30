// 스도쿠 알고리즘
// 1. 정답판
// 2. 문제판(유일 해)
// 3. 빈 칸들에 들어가야 하는 값들

class SudokuClient {
  constructor() { }

  createGame(holes) {
    this._holes = holes;
    this._solvedBoard = this.createSolvedBoard();
    this.createStartingBoard(this.solvedBoard, holes);
  }

  get solvedBoard() {
    return this._solvedBoard.map(v => v.slice());
  }

  get startingBoard() {
    return this._startingBoard?.map(v => v.slice())
  }

  get answers() {
    return this._answers.slice();
  }

  createSolvedBoard() {
    return this.fillBoard(Array.from(Array(9), () => Array(9).fill(0)));
  }

  createStartingBoard(solvedBoard, holes) {
    let startingBoard = solvedBoard;
    this.pokeHoles(startingBoard, holes);
    this._startingBoard = startingBoard;
  }

  pokeHoles(board, holes) {
    this._answers = [];
    const solutions = [board.map(v => v.slice())];
    let currentHoles = 0;
    while (currentHoles < holes) {
      const randomValue = Math.floor(Math.random() * 81);
      const randomRowIndex = Math.floor(randomValue / 9);
      const randomColIndex = randomValue % 9;

      if (!board[randomRowIndex]) continue;
      if (board[randomRowIndex][randomColIndex] == 0) continue;

      const dummyBoard = board.map(v => v.slice());
      dummyBoard[randomRowIndex][randomColIndex] = 0;

      const candidateBoard = this.fillBoard(dummyBoard.map(v => v.slice()));
      if (!this.includesInSolutions(solutions, candidateBoard)) {
        solutions.push(solutions);
      }

      if (solutions.length > 1) {
        return this.createGame(this._holes);
      }

      this._answers.push({
        rowIndex: randomRowIndex,
        colIndex: randomColIndex,
      })
      board[randomRowIndex][randomColIndex] = 0;
      currentHoles++;
    }
  }


  includesInSolutions(solutions, candidateBoard) {
    const flatCandidateBoard = candidateBoard.flat();
    for (const solution of solutions) {
      const flatSolution = solution.flat();
      const difference = flatCandidateBoard.filter(x => !flatSolution.includes(x));
      if (difference.length > 0) {
        return false;
      }
    }
    return true;
  }

  fillBoard(baseBoard) {
    let result = baseBoard.map(v => v.slice());
    while (true) {
      const emptyCell = this.nextEmptyCell(result);
      if (emptyCell.rowIndex === null || emptyCell.colIndex === null) {
        break;
      }
      const candidatesForCell = this.shuffledSudokuNumbers().filter((candidateNumber) => this.allPass(result, emptyCell, candidateNumber));
      if (candidatesForCell.length === 0) {
        // result = baseBoard.map(v => v.slice());
        result = Array.from(Array(9), () => Array(9).fill(0));
        continue;
      }

      result[emptyCell.rowIndex][emptyCell.colIndex] = candidatesForCell.shift();

    }
    return result;
  }


  nextEmptyCell(board) {
    const result = { rowIndex: null, colIndex: null }

    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      const row = board[rowIndex];
      const firstZeroCell = row.find((col) => col === 0);
      if (firstZeroCell !== undefined) {
        result.rowIndex = rowIndex;
        result.colIndex = row.indexOf(firstZeroCell);
        break;
      }
    }
    return result;
  }

  shuffledSudokuNumbers() {
    let result = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  allPass(board, cell, num) {
    return this.rowPass(board, cell, num) && this.colPass(board, cell, num) && this.boxPass(board, cell, num);
  }

  rowPass(board, cell, num) {
    return board[cell.rowIndex].indexOf(num) < 0;
  }

  colPass(board, cell, num) {
    return !board.some(row => row[cell.colIndex] === num);
  }

  boxPass(board, cell, num) {
    const boxStartRow = cell.rowIndex - (cell.rowIndex % 3);
    const boxStartCol = cell.colIndex - (cell.colIndex % 3);

    for (const boxRow of [0, 1, 2]) {
      for (const boxCol of [0, 1, 2]) {
        if (board[boxStartRow + boxRow][boxStartCol + boxCol] === num) {
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = {
  SudokuClient
}