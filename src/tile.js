export default class Tile {

    constructor(props) {
        this.props = props;

        const { canvasElement, position } = props;
        const context = canvasElement.getContext('2d');

        // Draw image
        this.drawImage(context);

        // Bind click to canvas element
        canvasElement.onclick = this.onTileClick.bind(this);
    }

    drawImage(context) {
        context.drawImage(
            this.props.image,
            this.props.coordinates.x * this.props.width,
            this.props.coordinates.y * this.props.height,
            this.props.width,
            this.props.height,
            0,
            0,
            this.props.width,
            this.props.height
        );
    }

    onTileClick() {
        this.props.onClickHandler(this.props.canvasElement, this.props.position);
    }
}