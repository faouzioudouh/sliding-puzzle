import isEqual from 'lodash/fp/isEqual';
import { createDOMElement } from './helpers';

export default class Tile {

    constructor(props) {
        this.props = props;
        this.isEmpty = props.isEmpty;

        const canvasElement = createDOMElement('canvas')({
            width: this.props.width,
            height: this.props.height
        });
        const context = canvasElement.getContext('2d');

        this.drawImage(context);
        canvasElement.onclick = this.onTileClick.bind(this);
        this.canvasElement = canvasElement;
    }

    /**
     * Draw the image on the given canvas context
     * @param {Object} context 
     */
    drawImage(context) {
        context.drawImage(
            this.props.image,
            this.props.expectedCoordinates.x * this.props.width,
            this.props.expectedCoordinates.y * this.props.height,
            this.props.width,
            this.props.height,
            0,
            0,
            this.props.width,
            this.props.height
        );
    }

    /**
     * @desc On tile click callback
     */
    onTileClick() {
        this.props.onClickHandler(this);
    }

    /**
     * @desc set the given coordinates as the current coordinates.
     * @param {Object} newCurrentCoordinates 
     */
    setCurrentCoordinates(newCurrentCoordinates) {
        this.props.currentCoordinates = newCurrentCoordinates;
    }

    /**
     * @desc get the current coordinates.
     * @returns {Object} currentCoordinates 
     */
    getCurrentCoordinates() {
        return this.props.currentCoordinates;
    }

    /**
     * @desc get the expected coordinates.
     * @returns {Object} expectedCoordinates 
     */
    getExpectedCoordinates() {
        return this.props.expectedCoordinates;
    }

    /**
     * @desc 
     */
    isAtTheRightPlace() {
        return this.isEmpty || isEqual(this.props.currentCoordinates, this.props.expectedCoordinates);
    }

    /**
     * @desc Render the tile!
     */
    render(className) {
        className && this.canvasElement.classList.add(className);
        return this.canvasElement;
    }
}