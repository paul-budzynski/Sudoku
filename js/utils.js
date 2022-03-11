class UT {
    static removeFromTab(tab,value) {
        for(let i = 0; i < tab.length; i++){ 
            if ( tab[i] == value) { 
                tab.splice(i, 1); 
            }
        }
        return tab;
    }

// Get random 1-9
    static getRowNumbers() {
        let seq = [];
        let temp = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        while (temp.length > 1) {
            let random = Math.ceil(Math.random() * temp.length) - 1;
            seq.push(temp[random]);
            temp.splice(random, 1);
        }
        seq.push(temp[0]);
        return seq;
    }

    // Check new line valid
    static checkLine(line, matrix, row) {
        return row.every(function(v, i) {
            // check column
            for (let p = line - 1; p >= 0; p--) {
                if (matrix[p][i] === v) {
                    return false;
                }
            }

            // check block
            let xOffset = i % 3;
            let yOffset = line % 3;
            for (let x = i - xOffset; x < i - xOffset + 3; x++) {
                for (let y = line - yOffset; y < line; y++) {
                    if (matrix[y][x] === v) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    // Get last Row from above lines
    static getLastLine(matrix) {
        let column = 0;
        let row = [];

        while (column < 9) {
            let temp = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            matrix.forEach(function(v, i) {
                let index = temp.indexOf(v[column]);
                temp.splice(index, 1);
            });
            column++;
            row.push(temp[0]);
        }
        return row;
    }

    static getFull() {
        let matrix = [];

        // line 1 to line 8
        for (let i = 0, len = 8; i < len; i++) {
            let row = UT.getRowNumbers();
            if (i !== 0) {
                let randomCount = 1;
                while (!UT.checkLine(i, matrix, row)) {
                    row = UT.getRowNumbers();
                    randomCount++;

                    if (randomCount > 70000) {
                        return UT.getFull();
                    }
                }
                matrix.push(row);
            } else {
                matrix.push(row);
            }
        }

        // fill line 9
        let lastRow = UT.getLastLine(matrix);
        if (!UT.checkLine(8, matrix, lastRow)) {
            return UT.getFull();
        } else {
            matrix.push(lastRow);
        }
        return matrix;
    }

    static blink(lack) {
        let matrix = UT.getFull();

        lack = lack && /^\d+$/.test(lack) ? (lack > 64 ? 16 : Math.abs(lack)) : 16;

        while (lack--) {
            let index = Math.ceil(Math.random() * 81) - 1;
            let row = Math.floor(index / 9);
            let column = index % 9;
            while (matrix[row][column] === 0) {
                index = Math.ceil(Math.random() * 81) - 1;
                row = Math.floor(index / 9);
                column = index % 9;
            }
            matrix[row][column] = 0;
        }

        return matrix;
    }

    static isRepeat(arr) {
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check sudoku result.
     * @param {Array[]} matrix
     * @returns Boolean | Object
     */
    // TODO Simplifier
     static checkMatrix(matrix) {
        let i, len;

        // Check row
        for (i = 0, len = matrix.length; i < len; i++) {
            if (matrix[i].indexOf(0) !== -1) {
                return false;
            } else if (UT.isRepeat(matrix[i])) {
                return {
                    row: i
                };
            }
        }

        // Check column
        let s;
        let count = 9;
        while (count--) {
            s = [];
            for (i = 0; i < 9; i++) {
                if (!/^[1-9]$/.test(matrix[i][count])) {
                    return false;
                } else if (s.indexOf(matrix[i][count]) !== -1) {
                    return {
                        column: count
                    };
                }
                s.push(matrix[i][count]);
            }
        }

        // Check block
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                let m = x * 3;
                let n = y * 3;
                let block = [
                    matrix[m][n], matrix[m][n+1], matrix[m][n+2],
                    matrix[m+1][n], matrix[m+1][n+1], matrix[m+1][n+2],
                    matrix[m+2][n], matrix[m+2][n+1], matrix[m+2][n+2]
                ];

                if (block.indexOf(0) !== -1) {
                    return false;
                } else if (UT.isRepeat(block)) {
                    return {
                        block: [x, y]
                    };
                }
            }
        }

        return true;
    }
}
