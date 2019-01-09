/*

--- Directions
Write a function that accepts an integer N
and returns a NxN spiral matrix

--- Examples
  matrix(2)
    [[undefined, undefined],
    [undefined, undefined]]
  matrix(3)
    [[1, 2, 3],
    [8, 9, 4],
    [7, 6, 5]]
 matrix(4)
    [[1,   2,  3, 4],
    [12, 13, 14, 5],
    [11, 16, 15, 6],
    [10,  9,  8, 7]]

Ref: https://github.com/StephenGrider/AlgoCasts
*/

let spiralMatrix = function(n) {
    let row = 0, column = 0, itCtr = 0;
    let count = 0;
    let filledCells = [];
    let matrix = [];
    
    /* initialize matrix */
    for (let i = 0; i < n; i++) {
      matrix[i] = [];
    }
    
    while (count < n * n) {
        /* top side */
        while (column < n - itCtr) {
          if (filledCells.indexOf(`${row},${column}`) === -1) {
            matrix[row][column] = ++count;
            filledCells.push(`${row},${column}`);
          }
          column++;
        }
        column--;
      
        /* right side */
        while (row < n - itCtr) {
          row++;
          if ((row < n - itCtr) && filledCells.indexOf(`${row},${column}`) === -1) {
            matrix[row][column] = ++count;
            filledCells.push(`${row},${column}`);
          }
        }
        row--;
      
        /* bottom side */
        while (column >= itCtr ) {
          column--;
          if (column >= itCtr && filledCells.indexOf(`${row},${column}`) === -1) {
            matrix[row][column] = ++count;
            filledCells.push(`${row},${column}`);
          }
        }
        column++;
      
        /* left side */
        while (row >= itCtr) {
          row--;
          if (row >= itCtr && filledCells.indexOf(`${row},${column}`) === -1) {
            matrix[row][column] = ++count;
            filledCells.push(`${row},${column}`);
          }
        }
        row++;

        /* increment to next spiral */
        itCtr++;
        row = column = itCtr;
    }

    return matrix;
}

console.log(spiralMatrix(5));