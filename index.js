const { SudokuClient } = require('./sudoku');
const sudokuClient = new SudokuClient();
sudokuClient.createGame(53);

console.log('solvedBoard', sudokuClient.solvedBoard);
console.log('startingBoard', sudokuClient.startingBoard);
console.log('answers', sudokuClient.answers);