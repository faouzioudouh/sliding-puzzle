import range from 'lodash/fp/range';
import shuffle from 'lodash/fp/shuffle';
import { loadImage, createDOMElement } from './helpers';
import Puzzle from './Puzzle';

import mediaMonksImage from './assets/monks.jpg';

const PUZZLE_SIZE = 4;
const rootElement = document.getElementById('root');
const movesElement = document.getElementById('moves');
const solvedElement = document.getElementById('solved');
const previewElement = document.getElementById('preview');
const newGameElement = document.getElementById('new-game');

const init = image => {
    // Instantiate the puzzle!
    const puzzle = new Puzzle(PUZZLE_SIZE, image, rootElement, 'tile');

    // Render the Puzzle
    puzzle.render();

    //Subscribe to the puzzle state
    puzzle.subscribe(({ moves, solved }) => {
        movesElement.innerHTML = moves;
        solvedElement.innerHTML = solved ? 'Yes' : 'No';
    });

    // Set preview image
    const previewImage = createDOMElement('img')({
        src: image.src,
        width: 90
    });
    previewElement.appendChild(previewImage);

    // render new game on click
    newGameElement.onclick = puzzle.shuffleTiles.bind(puzzle);
}

loadImage(mediaMonksImage, init);