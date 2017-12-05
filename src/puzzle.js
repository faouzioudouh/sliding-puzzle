import range from 'lodash/fp/range';
import shuffle from 'lodash/fp/shuffle';

import Tile from './tile';

const EMPTY_TILE = '';

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
export default class Puzzle {

    constructor(size, image, root) {

        this.root = root;
        this.size = size;
        this.image = image;
        this.tiles = [];

        this.state = {
            tiles: [],
            solved: true,
        };

        this.buildPuzzle();
        this.buildTiles();
    }

    setState(newState) {
        const stateToRender = Object.assign(this.state, newState);
    }

    buildTiles() {
        var tileWidth = this.image.width / this.size;
        var tileHeight = this.image.height / this.size;

        const puzzle = this;

        const tiles = this.state.tiles
            .map(function (expectedPosition, position) {
                var expectedCoordinates = this.getTileCoordinates(expectedPosition - 1);
                var currentCoordinates = this.getTileCoordinates(position);

                // console.log('expectedCoordinates', expectedCoordinates);
                // console.log('currentCoordinates', currentCoordinates);
                // console.log('is empty', expectedPosition === EMPTY_TILE);

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

        this.setState({solved: false, tiles})
    }

    moveTile(tileCoordinates) {
        var canTileMove = this.canTileMove(tileCoordinates);
        if (canTileMove) {
            this.swap(tileCoordinates);
            return true;
        }

        return false;
    }

    swap(tileCoordinates) {
        const tileToMove = this.getTileByCoordinates(tileCoordinates);
        const tileToMoveIndex = this.state.tiles.indexOf(tileToMove);

        const emptyTile = this.getEmptyTile();
        const emptyTileIndex = this.state.tiles.indexOf(emptyTile);

        tileToMove.setCurrentCoordinates(emptyTile.getCurrentCoordinates());        
        emptyTile.setCurrentCoordinates(tileCoordinates);

        this.state.tiles[tileToMoveIndex] = this.getEmptyTile();
        this.state.tiles[emptyTileIndex] = tileToMove;

        this.solved = this.isSolved();
        // console.log(this);
        this.render();
    }

    isSolved() {
        return this.state.tiles.every(tile => {
          const is = tile.isAtTheRightPlace();
          if (is) return is;
          console.log(tile.getCurrentCoordinates());
          return is;
        });
    }

    getEmptyTile() {
        return this.state.tiles.find(tile => tile.isEmpty);
    }

    canTileMove(coordinates) {
        let canTileMove = false;
        const max = this.size - 1;
        // console.log(coordinates);

        if (coordinates.x > 0) {
            const newCoordinates = Object.assign({}, coordinates, {x: coordinates.x - 1}); 
            // console.log('x - 1 ', this.getTileByCoordinates(newCoordinates));
            canTileMove = this.getTileByCoordinates(newCoordinates).isEmpty;
        }
        if (!canTileMove && coordinates.x < max) {
            const newCoordinates = Object.assign({}, coordinates, {x: coordinates.x + 1});             
            // console.log('x + 1 ', this.getTileByCoordinates(newCoordinates));
            canTileMove = this.getTileByCoordinates(newCoordinates).isEmpty;
        }
        if (!canTileMove && coordinates.y > 0) {
            const newCoordinates = Object.assign({}, coordinates, {y: coordinates.y - 1});             
            // console.log('y - 1 ', this.getTileByCoordinates(newCoordinates));            
            canTileMove = this.getTileByCoordinates(newCoordinates).isEmpty;
        }
        if (!canTileMove && coordinates.y < max) {
            const newCoordinates = Object.assign({}, coordinates, {y: coordinates.y + 1});             
            // console.log('y + 1 ', this.getTileByCoordinates(newCoordinates));            
            canTileMove = this.getTileByCoordinates(newCoordinates).isEmpty;
        }

        return canTileMove;
    }

    getTileByCoordinates(coordinates) {
        return this.state.tiles.find(tile => tile.props.currentCoordinates.x == coordinates.x && tile.props.currentCoordinates.y == coordinates.y);
    }

    buildPuzzle() {
        this.sortedTiles = range(1, Math.pow(this.size, 2));
        this.sortedTiles.push('');

        this.state.tiles = this.sortedTiles;// shuffle(this.sortedTiles);
        this.emptyTile = this.size;
    }

    getTileCoordinates(position) {
        return {
            x: position % this.size,
            y: Math.floor(position / this.size)
        };
    }

    render() {
        var fragment = document.createDocumentFragment();
        this.state.tiles.forEach(tile => fragment.appendChild(tile.render()), this);
        this.root.appendChild(fragment);
    }
}