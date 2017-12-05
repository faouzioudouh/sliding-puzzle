import range from 'lodash/fp/range';
import shuffle from 'lodash/fp/shuffle';

import Tile from './tile';
import Puzzle from './puzzle';

const PUZZLE_SIZE = 4;

const init = image => {
    const puzzle = new Puzzle(PUZZLE_SIZE, image, document.getElementById('tiles'));
    console.log(puzzle);
    puzzle.render();
}

const loadNewImage = onload => {
    var image = new Image();
    image.src = 'http://i.giphy.com/LhenEkp5EsPJe.gif';
    image.onload = onload.bind(null, image);
};


loadNewImage(init);