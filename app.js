const messageElement = document.querySelector('.message-container');
const gridElement = document.querySelector('.grid-container');
const keyboardElement = document.querySelector('.keyboard-container');

const getWordle = () => {
    fetch('http://localhost:8000/word')
        .then(response => response.json())
        .then(json => {
            console.log(json);
            wordle = json.toUpperCase();
        })
        .catch(err => console.log(err))
};
let wordle = getWordle();

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
]

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
    guessRow.forEach((_guess, guessIndex) => {
        const tileElement = document.createElement('div');
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
        tileElement.classList.add('tile');
        rowElement.append(tileElement);
    });
    gridElement.append(rowElement);
});

const addLetter = (letter) => {
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = letter;
    tile.setAttribute('data', letter);
    guessRows[currentRow][currentTile] = letter;
    currentTile++;
};

const deleteLetter = () => {
    currentTile--;
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = '';
    tile.removeAttribute('data');
    guessRows[currentRow][currentTile] = '';
};

const showMessage = (message_text) => {
    const message = document.createElement('p');
    message.textContent = message_text;
    messageElement.append(message);
    setTimeout(() => messageElement.removeChild(message), 2000);
};

const addColorToKey = (letter, color) => {
    const key = document.getElementById(letter);
    key.classList.add(color);
};

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
    let checkWordle = wordle;
    const guess = [];

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'gray-overlay'});
    });

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]){
            guess.color = 'green-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        };

    });

    guess.forEach(guess => {
        if (wordle.includes(guess.letter)){
            guess.color == 'yellow-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        };

    });

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)){
            guess.color = 'yellow-overlay';
            checkWordle.replace(guess.letter, '');
        };
    });

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(guess[index].color);
            addColorToKey(guess[index].letter, guess[index].color);
        }, 500 * index);
    });

};

const checkRow = () => {
    const guess = guessRows[currentRow].join('');
    fetch(`http://localhost:8000/check/?word=${guess}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            if (json == false) {
                showMessage("Word is not valid.");
            } else {
                console.log('guess is ' + guess);
                flipTile();
                if (wordle === guess) {
                    showMessage("You've guessed it!");
                    isGameOver = true;
                    return;
                } else {
                    if (currentRow >= 5) {
                        showMessage("Game Over!");
                        isGameOver = true;
                        return;
                    }; if (currentRow < 5) {
                        currentRow++;
                        currentTile = 0;
                    };
                };
            };
        })
        .catch(err => console.log(err))
};

const handleClick = (key) => {
    if (!isGameOver) {
        console.log('clicked', key);
        if (key === '«') {
            if (currentTile > 0) {
                console.log('Delete letter');
                deleteLetter();
            } else {
                return;
            };
        } else if (key === 'ENTER') {
            if (currentTile === 5) {
                console.log('Check row');
                checkRow();
            } else {
                return;
            }
        } else {
            if (currentTile < 5 && currentRow < 6) {
                console.log('Add letter');
                addLetter(key);
            };
        };
        console.log(currentTile);
        console.log('guessRows', guessRows);
    };
};

keys.forEach(key => {
    const keyElement = document.createElement('button');
    keyElement.textContent = key;
    keyElement.setAttribute('id', key);
    keyElement.addEventListener('click', () => handleClick(key));
    keyboardElement.append(keyElement);
});