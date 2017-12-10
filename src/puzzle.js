import range from 'lodash/fp/range';
import shuffle from 'lodash/fp/shuffle';
import isEqual from 'lodash/fp/isEqual';
import isFunction from 'lodash/fp/isFunction';
import isElement from 'lodash/fp/isElement';

import {
    getCoordinatesByPosition,
    swapItemsInArray,
    createDOMElement,
    swapTwoNodes
} from './helpers';
import Tile from './Tile';

const EMPTY_TILE = 'EMPTY_TILE';

export default class Puzzle {
    constructor(size, image, rootElement, tileClassName) {
        if (!size)
            throw new Error('Please provide the size of the puzzle.');
        if (!(image instanceof HTMLImageElement))
            throw new Error('Please provide the image of the puzzle.');
        if (!isElement(rootElement))
            throw new Error('Please provide the element to render the puzzle.');

        this.rootElement = rootElement;
        this.size = size;
        this.image = image;
        this.tileClassName = tileClassName;
        this.callbacks = [];
        this.getTileCoordinates = getCoordinatesByPosition(this.size);

        this.state = {
            tiles: [],
            solved: false,
            moves: 0
        };

        this.buildPuzzle();
    }

    /**
     * @desc build buzzle
     */
    buildPuzzle() {
        const tilesIndex = range(1, Math.pow(this.size, 2));
        tilesIndex.push(EMPTY_TILE);

        const shuffledRange = shuffle(tilesIndex);

        this.setState({
            tiles: this.buildTiles(shuffledRange)
        });

        // render the new state!
        this.render();
    }

    /**
     * @desc Build array of tiles
     * @return {Tile[]}
     * @param {Array} range 
     */
    buildTiles(range) {
        const tileWidth = this.image.width / this.size;
        const tileHeight = this.image.height / this.size;

        return range
            .map((expectedPosition, position) => {
                const expectedCoordinates = this.getTileCoordinates(expectedPosition - 1);
                const currentCoordinates = this.getTileCoordinates(position);

                const props = {
                    width: tileWidth,
                    height: tileHeight,
                    onClickHandler: this.moveTile.bind(this),
                    image: this.image,
                    isEmpty: expectedPosition === EMPTY_TILE,
                    expectedCoordinates,
                    currentCoordinates,
                };

                return new Tile(props);
            }, this);
    }

    /**
     * @desc merge the given state with the current state
     * @param {Object} newState 
     */
    setState(newState) {
        // update the state object
        Object.assign(this.state, newState);

        // Notify the subscribers about the new state!
        this.notifySubscribers();
    }

    /**
     * @desc Move the given tile!
     * @param {Tile} tileToMove 
     */
    moveTile(tileToMove) {
        this.canTileMove(tileToMove) && this.swap(tileToMove);
    }

    /**
     * @desc swap the given tile to the empty tile!
     * @param {Tile} tileToMove 
     */
    swap(tileToMove) {
        const tileToMoveCoordinates = tileToMove.getCurrentCoordinates();
        const emptyTile = this.getEmptyTile();

        // Update coordinates!
        tileToMove.setCurrentCoordinates(emptyTile.getCurrentCoordinates());
        emptyTile.setCurrentCoordinates(tileToMoveCoordinates);

        // Swap the tile with the empty tile.
        const newTiles = swapItemsInArray(this.state.tiles)(tileToMove, emptyTile);

        // Insread of re-rendeing the whole list, lets just swap the tiles!
        swapTwoNodes(this.rootElement)(emptyTile.render(), tileToMove.render());

        this.setState({
            tiles: newTiles,
            solved: this.isSolved(),
            moves: this.state.moves + 1
        });
    }

    /**
     * @desc Return true if the given tile can move, otherwise returns false!
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

        return coordinatesToCheck.some(coord => this.getTileByCoordinates(coord).isEmpty, this);
    }

    /**
     * @desc Return true if the puzzle is solved, otherwise returns false.
     * @returns {Boolean}
     */
    isSolved() {
        return this.state.tiles.every(tile => tile.isAtTheRightPlace());
    }

    /**
     * @desc Get the empty tile!
     * @returns {Tile}
     */
    getEmptyTile() {
        return this.state.tiles.find(tile => tile.isEmpty);
    }

    /**
     * @desc Get Tile by coordinates
     * @param {Object} coordinates
     * @returns {Tile} the tile that matches the given coordinates
     */
    getTileByCoordinates(coordinates) {
        return this.state.tiles.find(tile => isEqual(tile.getCurrentCoordinates(), coordinates));
    }

    /**
     * @desc Shuffle tiles!
     */
    shuffleTiles() {
        const newTiles = shuffle([...this.state.tiles]);
        const tiles = newTiles.map((tile, index) => tile.setCurrentCoordinates(this.getTileCoordinates(index)), this);
        this.setState({ tiles, moves: 0, solved: false });

        // render the new state!
        this.render();
    }

    /**
     * @desc add the given function to the stack of callbacks
     * callback will called with the state is changed!
     * @param {Function} callback 
     */
    subscribe(callback) {
        isFunction(callback) && this.callbacks.push(callback);
    }

    /**
     * @desc Notify all the subscribers about the state of the game.
     */
    notifySubscribers() {
        const state = {
            moves: this.state.moves,
            solved: this.state.solved
        };
        this.callbacks.forEach(callback => callback(state));
    }

    /**
     * @desc Render the puzzle in the given root element
     */
    render() {
        // clear root element
        this.rootElement.innerHTML = '';

        if (this.state.solved) {
            const image = createDOMElement('img')({
                src: this.image.src,
                width: 400
            });
            return this.rootElement.appendChild(image);
        } else {
            const fragment = document.createDocumentFragment();
            this.state.tiles.forEach(tile =>
                fragment.appendChild(tile.render(this.tileClassName)), this);
            this.rootElement.appendChild(fragment);
        }
    }
}