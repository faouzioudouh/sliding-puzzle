import range from 'lodash/fp/range';
import shuffle from 'lodash/fp/shuffle';
import { loadImage } from './helpers';
import Puzzle from './Puzzle';

import mediaMonksImage from './assets/monks.jpg';

const PUZZLE_SIZE = 4;
const rootElement = document.getElementById('root');
const movesElement = document.getElementById('moves');
const solvedElement = document.getElementById('solved');

const init = image => {
    // Instantiate the puzzle!
    const puzzle = new Puzzle(PUZZLE_SIZE, image, rootElement, 'tile');

    // Render the Puzzle
    puzzle.render();
    puzzle.subscribe(({ moves, solved }) => {
        movesElement.innerHTML = moves;
        solvedElement.innerHTML = solved ? 'True' : 'False';
    });
}

loadImage(mediaMonksImage, init);