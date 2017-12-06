import range from 'lodash/fp/range';
import shuffle from 'lodash/fp/shuffle';
import isEqual from 'lodash/fp/isEqual';
import isFunction from 'lodash/fp/isFunction';
import noop from 'lodash/fp/noop';

import Tile from './tile';
import { getCoordinatesByPosition } from './helpers';

const EMPTY_TILE = 'EMPTY_TILE';

export default class Puzzle {
    constructor(size, image, rootElement, onMove) {

        this.rootElement = rootElement;
        this.size = size;
        this.image = image;
        this.getTileCoordinates = getCoordinatesByPosition(this.size);
        this.onMove = isFunction(onMove) ? onMove : noop;

        this.state = {
            tiles: [],
            solved: false,
        };

        this.buildPuzzle();
    }

    setState(newState) {
        Object.assign(this.state, newState);
        this.render();
    }

    /**
     * Build array of tiles
     * @param {Array} range 
     */
    buildTiles(range) {
        var tileWidth = this.image.width / this.size;
        var tileHeight = this.image.height / this.size;

        return range
            .map(function (expectedPosition, position) {
                var expectedCoordinates = this.getTileCoordinates(expectedPosition - 1);
                var currentCoordinates = this.getTileCoordinates(position);

                const props = {
                    width: tileWidth,
                    height: tileHeight,
                    onClickHandler: this.moveTile.bind(this),
                    image: this.image,
                    isEmpty: expectedPosition === EMPTY_TILE,
                    expectedCoordinates,
                    currentCoordinates,
                    position,
                };

                return new Tile(props);
            }, this);
    }

    moveTile(tileCoordinates) {
        this.canTileMove(tileCoordinates) && this.swap(tileCoordinates);
    }

    /**
     * swap the given tile to the empty tile!
     * @param {Tile} tileToMove 
     */
    swap(tileToMove) {
        const tileToMoveCoordinates = tileToMove.getCurrentCoordinates();
        const tileToMoveIndex = this.state.tiles.indexOf(tileToMove);

        const emptyTile = this.getEmptyTile();
        const emptyTileIndex = this.state.tiles.indexOf(emptyTile);

        tileToMove.setCurrentCoordinates(emptyTile.getCurrentCoordinates());
        emptyTile.setCurrentCoordinates(tileToMoveCoordinates);

        // let's not mutate the state object directely!
        const newTiles = [...this.state.tiles];

        newTiles[tileToMoveIndex] = this.getEmptyTile();
        newTiles[emptyTileIndex] = tileToMove;

        this.onMove(tileToMove);
        this.setState({tiles: newTiles, solved: this.isSolved()});
    }

    /**
     * Return true if the puzzle is solved, otherwise return false.
     */
    isSolved() {
        return this.state.tiles.every(tile => tile.isAtTheRightPlace());
    }

    /**
     * Get the empty tile!
     */
    getEmptyTile() {
        return this.state.tiles.find(tile => tile.isEmpty);
    }

    /**
     * Return true if the given tile can move, otherwise return false!
     * @param {Object} tile 
     */
    canTileMove(tile) {
        const coordinates = tile.getCurrentCoordinates();
        const coordinatesToCheck = [];
        const max = this.size - 1;
        let canTileMove = false;
        
        // Check if tile can move LEFT
        if (coordinates.x > 0) {
            coordinatesToCheck.push({
                ...coordinates,
                x: coordinates.x - 1
            });
        }

        // Check if tile can move RIGHT
        if (coordinates.x < max) {
            coordinatesToCheck.push({
                ...coordinates,
                x: coordinates.x + 1
            });
        }

        // Check if tile can move TOP
        if (coordinates.y > 0) {
            coordinatesToCheck.push({
                ...coordinates,
                y: coordinates.y - 1
            });
        }

        // Check if tile can move BOTTOM
        if (coordinates.y < max) {
            coordinatesToCheck.push({
                ...coordinates,
                y: coordinates.y + 1
            });
        }

        return coordinatesToCheck.some (coord => this.getTileByCoordinates(coord).isEmpty, this);
    }

    /**
     * get Tile by coordinates
     * @param {Object} coordinates 
     */
    getTileByCoordinates(coordinates) {
        return this.state.tiles.find(tile => isEqual(tile.getCurrentCoordinates(), coordinates));
    }

    /**
     * build buzzle
     */
    buildPuzzle() {
        const tilesIndex = range(1, Math.pow(this.size, 2));
        tilesIndex.push(EMPTY_TILE);

        const shuffledRange = shuffle(tilesIndex);

        this.setState({
            tiles: this.buildTiles(shuffledRange)
        });
    }

    shuffleTiles() {
        const tiles = shuffle(this.state.tiles);
        this.setState({tiles});
    }

    /**
     * render the puzzle in the given root element
     */
    render() {
        // clear root element
        this.rootElement.innerHTML = '';

        if (this.state.solved) {
            const image = document.createElement('img');
            image.src = this.image.src;
            image.width = 400;
            return this.rootElement.appendChild(image);
        } else {
            var fragment = document.createDocumentFragment();
            this.state.tiles.forEach(tile => fragment.appendChild(tile.render()), this);
            this.rootElement.appendChild(fragment);
        }
    }
}