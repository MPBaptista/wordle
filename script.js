const messageElement = document.querySelector('.message-container');
const gridElement = document.querySelector('.grid-container');
const keyboardElement = document.querySelector('.keyboard-container');

const wordle = 'SUPER';

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

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
    rowTiles.forEach((tile, index) => {
        const  tileLetter = tile.getAttribute('data');

        setTimeout(() => {
            tile.classList.add('flip');
            if (tileLetter == wordle[index]) {
                tile.classList.add('green-overlay');
            } else if (wordle.includes(tileLetter)) {
                tile.classList.add('yellow-overlay');
            } else {
                tile.classList.add('gray-overlay');
            };
        }, 250 * index);
    });
};

const checkRow = () => {
    const guess = guessRows[currentRow].join('');
    console.log('guess is ' + guess);
    flipTile();
    if (wordle === guess) {
        showMessage("You've guessed it!");
    } else {
        if (currentRow >= 5) {
            showMessage("Game Over!");
        }; if (currentRow < 5) {
            currentRow++;
            currentTile = 0;
        };
    };
};

const handleClick = (key) => {
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

keys.forEach(key => {
    const keyElement = document.createElement('button');
    keyElement.textContent = key;
    keyElement.setAttribute('id', key);
    keyElement.addEventListener('click', () => handleClick(key));
    keyboardElement.append(keyElement);
});