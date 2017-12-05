import range from 'lodash/fp/range';
import shuffle from 'lodash/fp/shuffle';

import Tile from './tile';
import Puzzle from './puzzle';

const PUZZLE_SIZE = 4;


const init = tilesIds => image => {
    var tileWidth = image.width / PUZZLE_SIZE;
    var tileHeight = image.height / PUZZLE_SIZE;

    const tiles = tilesIds
    .map(function(number, currentPosition) {
        var drawImage = number ? true : false;
        var expectedPosition = number - 1;
        var coordinates = getTileCoordinates(expectedPosition);

        const canvasElement = document.createElement('canvas');
        canvasElement.setAttribute('data-position', expectedPosition);

        document.getElementById('tiles').appendChild(canvasElement);

        const props = {
            position: currentPosition,
            drawImage: drawImage,
            width: tileWidth,
            height: tileHeight,
            onClickHandler: (ele, pos) => console.log(pos),
            image,
            canvasElement,
            coordinates,
        };

        return new Tile(props);
    });

    console.log(tiles);    
}


const getTileCoordinates = position =>
    ({
        x: position % PUZZLE_SIZE,
        y: Math.floor(position / PUZZLE_SIZE)
    });


const loadNewImage = onload => {
    var image = new Image();
    image.src = 'http://i.giphy.com/LhenEkp5EsPJe.gif';
    image.onload = onload.bind(null, image);
};


var sortedTiles = range(1, Math.pow(PUZZLE_SIZE, 2));
var shuffledTiles = shuffle(sortedTiles);
shuffledTiles.push('');
sortedTiles.push('');

const puzzle = new Puzzle(shuffledTiles, shuffledTiles.length - 1, sortedTiles);

loadNewImage(init(puzzle.tiles));
