const prompt = require('prompt-sync')({sigint: true});
const term = require( 'terminal-kit' ).terminal;

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this._field = field;
  }

  game() {
    let x = 0;
    let y = 0;
    this.print(this._field);
    while (this._field[y][x] === pathCharacter || this._field[y][x] === fieldCharacter) {
        // prompt
        let direction = prompt('Which direction would you like to go? Please enter N for North, E for East, S for South, or W for West.');
        // determining whether input is allowed
        if (direction.toUpperCase() === 'N') {
            if (y === 0) {
                term.red("You cannot travel further North, please enter another direction.");
                console.log("");
            } else {
                y -= 1;
            }
        } else if (direction.toUpperCase() === 'E') {
            if (x === this._field[y].length - 1) {
                term.red("You cannot travel further East, please enter another direction.");
                console.log("");
            } else {
                x += 1;
            }
        } else if (direction.toUpperCase() === 'S') {
            if (y === this._field.length - 1) {
                term.red("You cannot travel further South, please enter another direction.");
                console.log("");
            } else {
                y += 1;
            }
        } else if (direction.toUpperCase() === 'W') {
            if (x === 0) {
                term.red("You cannot travel further West, please enter another direction.");
                console.log("");
            } else {
                x -= 1;
            }
        } else {
            term.red("Please enter a valid direction.")
        }
        // moving path character if required, not falling in holes or finding hat
        if (this._field[y][x] === hat) {
            term.green("Congratulations, you found the hat!");
            console.log("");
        } else if (this._field[y][x] === hole) {
            term.bold.underline.red("Oh no! You fell in a hole! Game over!");
            console.log("");
        } else {
            this._field[y][x] = pathCharacter;
        }
        this.print(this._field);
    }
  }

  print() {
    for (let row in this._field) {
      console.log(this._field[row].join(''));
    }
  }

  static generateField(height, width, holes) {
    // empty field ready to grow on
    let newField = [];
    // first grow some nice grass uniformly
    for (let i = 0; i < height; i++) {
        newField.push([]);
        for (let j = 0; j < width; j++) {
            newField[i].push(fieldCharacter);
        }
    }
    // place start on first sqaure
    newField[0][0] = pathCharacter;
    // randomly dig holes
    let holePositions = [];
    let position = [];
    let row;
    let col;
    while (holePositions.length < holes) {
        position = [];
        row = Math.floor(Math.random() * height);
        col = Math.floor(Math.random() * width);
        position.push(row, col);
        // choose another place for a whole if already chosen or where the cursor starts
        if (!holePositions.includes(position) && !(position === [0, 0])) {
            holePositions.push(position);
        }
    }
    // dig the holes
    for (let holeNum = 0; holeNum < holes; holeNum++) {
        newField[holePositions[holeNum][0]][holePositions[holeNum][1]] = hole;
    }
    // randomly place hat somewhere
    let hatPosition = [];
    while (hatPosition.length < 1) {
        position = [];
        row = Math.floor(Math.random() * height);
        col = Math.floor(Math.random() * width);
        position.push(row, col);
        if (!holePositions.includes(position) && !(position === [0, 0])) {
            hatPosition.push(position);
        }
    }
    newField[hatPosition[0][0]][hatPosition[0][1]] = hat;

    // return lovely field
    return newField;
  }
}

const test = Field.generateField(10, 10, 15);

const myField = new Field(test);

myField.game();