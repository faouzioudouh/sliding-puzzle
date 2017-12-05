import range from 'lodash/fp/range';
import shuffle from 'lodash/fp/shuffle';

export default class Puzzle {

    constructor(tiles, emptyTile, expected) {

        this.size = Math.sqrt(tiles.length);
        this.tiles = tiles;
        this.emptyTile = emptyTile;
        this.expected = expected;
    }

    getTileCoordinates(position) {
        return {
            x: position % this.size,
            y: Math.floor(position / this.size)
        };
    }

    buildFromSize(size) {
        var sortedTiles = range(1, Math.pow(size, 2));
        var shuffledTiles = shuffle(sortedTiles);
        shuffledTiles.push('');
        sortedTiles.push('');
        return new Puzzle(shuffledTiles, shuffledTiles.length - 1, sortedTiles);
    }
}