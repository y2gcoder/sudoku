class Sudoku {

  constructor(holes) {
    this._solvedBoard = this.createSolvedBoard();
    const [removedValues, startingBoard] = this.pokeHoles(this.solvedBoard.map(row => row.slice()), holes);
    this._startingBoard = startingBoard;
    this._removeValues = removedValues;
  }

  get solvedBoard() {
    return this._solvedBoard;
  }

  set solvedBoard(board) {
    this._solvedBoard = board;
  }

  get startingBoard() {
    return this._startingBoard;
  }

  set startingBoard(board) {
    this._startingBoard = board;
  }

  get removedValues() {
    return this._removeValues;
  }

  set removedValues(removeValues) {
    this._removeValues = removeValues;
  }

  createSolvedBoard() {
    try {
      const solvedBoard = this.createEmptyBoard();
      this.fillBoard(solvedBoard);
      return solvedBoard;
    } catch (error) {
      console.error(error);
      return this.createSolvedBoard();
    }

  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }

  fillBoard(board) {
    const emptyCell = this.nextEmptyCell(board);
    if (!emptyCell) {
      return board;
    }
    let counter = 0;
    for (const num of this.shuffledNumArray()) {
      counter++;
      if (counter > 20_000_000) {
        throw new Error("Recursion Timeout");
      }

      if (this.safeToPlace(board, emptyCell, num)) {
        board[emptyCell.rowIndex][emptyCell.colIndex] = num;

        if (this.fillBoard(board)) {
          return board;
        }
        board[emptyCell.rowIndex][emptyCell.colIndex] = 0;
      }
    }
    return false;
  }

  nextEmptyCell(board) {
    const emptyCell = { rowIndex: '', colIndex: '' };

    board.forEach((row, rowIndex) => {
      if (emptyCell.colIndex !== "") {
        return;
      }

      let firstZero = row.find((col) => col === 0);
      if (firstZero === undefined) {
        return;
      }

      emptyCell.rowIndex = rowIndex;
      emptyCell.colIndex = row.indexOf(firstZero);
    });

    if (emptyCell.colIndex !== "") {
      return emptyCell;
    }

    return false;
  }

  shuffledNumArray() {
    let result = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  safeToPlace(board, emptyCell, num) {
    return this.rowSafe(board, emptyCell, num) &&
      this.colSafe(board, emptyCell, num) &&
      this.boxSafe(board, emptyCell, num)
  }

  rowSafe(board, emptyCell, num) {
    return board[emptyCell.rowIndex].indexOf(num) == -1
  }

  colSafe(board, emptyCell, num) {
    return !board.some(row => row[emptyCell.colIndex] == num)
  }

  boxSafe(board, emptyCell, num) {
    const boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3);
    const boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3);

    let result = true;

    for (const boxRow of [0, 1, 2]) {
      for (const boxCol of [0, 1, 2]) {
        if (board[boxStartRow + boxRow][boxStartCol + boxCol] == num) {
          result = false;
        }
      }
    }
    return result;
  }

  pokeHoles(board, holes) {
    const removedValues = [];

    while (removedValues.length < holes) {
      const randomValue = Math.floor(Math.random() * 81);
      const randomRowIndex = Math.floor(randomValue / 9);
      const randomColIndex = randomValue % 9;

      if (!board[randomRowIndex]) continue;
      if (board[randomRowIndex][randomColIndex] == 0) continue;

      removedValues.push({
        rowIndex: randomRowIndex,
        colIndex: randomColIndex,
        value: board[randomRowIndex][randomColIndex],
      });
      board[randomRowIndex][randomColIndex] = 0;
      const changedBoard = board.map(row => row.slice());

      if (!this.fillBoard(changedBoard)) {
        board[randomRowIndex][randomColIndex] = removedValues.pop().value;
      }
    }
    return [removedValues, board];
  }
}

module.exports = {
  Sudoku
}