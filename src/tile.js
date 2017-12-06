import isEqual from 'lodash/fp/isEqual';

export default class Tile {

    constructor(props) {
        this.props = props;

        this.isEmpty = props.isEmpty;

        const canvasElement = document.createElement('canvas');
        const context = canvasElement.getContext('2d');
        canvasElement.width = this.props.width;
        canvasElement.height = this.props.height;

        // Draw image
        this.drawImage(context);

        // Bind click to canvas element
        canvasElement.onclick = this.onTileClick.bind(this);
        this.canvasElement = canvasElement;
    }

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

    onTileClick() {
        this.props.onClickHandler(this);
    }

    setCurrentCoordinates(newCurrentCoordinates) {
        this.props.currentCoordinates = newCurrentCoordinates;
    }

    getCurrentCoordinates() {
        return this.props.currentCoordinates;
    }

    getExpectedCoordinates() {
        return this.props.expectedCoordinates;
    }

    isAtTheRightPlace() {
        return this.isEmpty || isEqual(this.props.currentCoordinates, this.props.expectedCoordinates);
    }

    render(className) {
        className && this.canvasElement.classList.add('tile');
        return this.canvasElement;
    }
}