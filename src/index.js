import range from 'lodash/fp/range';
import shuffle from 'lodash/fp/shuffle';

import Puzzle from './puzzle';

const PUZZLE_SIZE = 4;

const init = image => {
    // Initialize the puzzle!
    const puzzle = new Puzzle(PUZZLE_SIZE, image, document.getElementById('tiles'), () => console.log('mooooved!!'));

    // Render the Puzzle
    puzzle.render();
}

/**
 * load image
 * @param {Function} onload on load image callback
 */
const loadImage = onload => {
    var image = new Image();
    image.src = 'http://i.giphy.com/LhenEkp5EsPJe.gif';
    image.onload = onload.bind(null, image);
};

loadImage(init);